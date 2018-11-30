import {makeWeatherDevice} from "./devices/weather";
import {tap} from "rxjs/operators";
import {makeDoorDevice} from "./devices/door";
import {makeHvacDevice} from "./devices/hvac";
import {HTTPDigestModule} from "./core/networking/http-digest";
import {AggregateEvent} from "./core/aggregate/types";
import {makeRegistry} from "./core/registry/Registry";
import {IOTDeviceRegistry, IOTDevice, DeviceCreatedEvent} from "./core/registry/types";
import {stateTable} from "./core/visualization/visualize";
import {makeLight} from "./devices/light.device";
import {makeOvenDevice} from "./devices/oven";
import {makeSinkDevice} from "./devices/sink.device";
const dotenv = require('dotenv')
const axios = require('axios')
const clear = require('clear')
require('console.table')

dotenv.config()
const {env} = process


/**
 * Initialize a bunch of devices
 * =====================================
 */
let registry: IOTDeviceRegistry = makeRegistry([
    makeHvacDevice('hvac', {title: 'HVAC'}),
    makeLight('basement_light', {title: 'Basement Light'}),
    makeLight('kitchen_light', {title: 'Kitchen Light'}),
    makeSinkDevice('kitchen_sink', {title: 'Kitchen Sink'}),
    makeOvenDevice('oven', {title: 'Oven'}),
    makeDoorDevice('garage_door', {title: 'Garage Door'}),
    makeWeatherDevice('weather_sensor', {title: 'Weather'})
])

// some devices require a manual start
registry.get('weather_sensor').controller.handle({ key: 'start' })
registry.get('hvac').controller.handle({ key: 'start' })


/**
 * Publish and Subscribe a network
 * ==============================================================
 */

// Publish all events onto node-red flow
registry.events$.subscribe((deviceEvent: AggregateEvent) => {
    axios.post(`${env.PUBLISH_COMMANDS_ENDPOINT}`, deviceEvent)
        .then(reply => null)
        .catch(error => console.log('could not dispatch to node-red'))
})


// Accept commands via an HTTP API
let port = env.PORT || 4000
HTTPDigestModule(registry.handle).app
    .listen(port, () => console.log(`HTTP API running on port ${port}`))


// render entire engine state in a tabular format
stateTable(registry).pipe(tap(clear), tap(console.table)).subscribe()


// Publish the device created events
registry.all().forEach(device => {
    let event: DeviceCreatedEvent = {
        aggregate_id: device.aggregate.id,
        key: 'created',
        payload: {
            id: device.aggregate.id,
            meta: device.aggregate.meta,
            state: device.aggregate.state$.value
        }
    }
    registry.events$.next(event)
})
