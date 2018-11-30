import {makeWeatherDevice} from "./devices/weather";
import {tap} from "rxjs/operators";
import {makeDoorDevice} from "./devices/door";
import {makeHvacDevice} from "./devices/hvac";
import {HTTPDigestModule} from "./core/networking/http-digest";
import {IIOTDeviceRegistry, makeRegistry} from "./core/registry/Registry";
import {stateTable} from "./core/visualization/visualize";
import {makeLight} from "./devices/light.device";
import {makeOvenDevice} from "./devices/oven";
import {makeSinkDevice} from "./devices/sink.device";

const dotenv = require('dotenv')
const clear = require('clear')
require('console.table')

dotenv.config()
const {env} = process


/**
 * Initialize a bunch of devices
 * =====================================
 */

const devices = [
    makeHvacDevice('hvac', {title: 'HVAC'}),
    makeLight('basement_light', {title: 'Basement Light'}),
    makeLight('kitchen_light', {title: 'Kitchen Light'}),
    makeSinkDevice('kitchen_sink', {title: 'Kitchen Sink'}),
    makeOvenDevice('oven', {title: 'Oven'}),
    makeDoorDevice('garage_door', {title: 'Garage Door'}),
    makeWeatherDevice('weather_sensor', {title: 'Weather'})
]

const registry: IIOTDeviceRegistry = makeRegistry()


/**
 * Publish and Subscribe a network
 * ==============================================================
 */

// Accept commands via an HTTP API
HTTPDigestModule(env)(registry)
    .app
    .listen(env.PORT || 4000, () => {
        console.log(`HTTP API running on port ${env.PORT || 4000}`)
    })


if(env.NODE_ENV !== 'production') {
    // render entire engine state in a tabular format
    stateTable(registry).pipe(tap(clear), tap(console.table)).subscribe()
}


// Add all of the devices to the registry
devices.forEach(registry.registerDevice)
registry.get('weather_sensor').controller.handle({ key: 'on' })