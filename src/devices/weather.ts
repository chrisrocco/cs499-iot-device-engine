import {makeController} from "../core/controller/Controller";
import {IOTDevice} from "../core/registry/types";
import {makeProcessManager} from "../core/process-manager/ProcessManager";
import {dispatch} from "../core/actions";
import {makeAggregate} from "../core/aggregate/Aggregate";
const lodash = require('lodash')

const initialState = {
    outdoor_temp: 74,
    feels_like: ''
}

const reducers = {
    'temp': (state, event) => {
        return {
            feels_like: (event.payload > 80)? 'hot' : (event.payload < 60) ? 'cold' : 'just right',
            outdoor_temp: state.outdoor_temp + event.payload
        }
    }
}

export const makeWeatherDevice = (id, meta = {}): IOTDevice => {

    let aggregate = makeAggregate(initialState, reducers)(id, meta)

    let pm = makeProcessManager({
        'main': () => dispatch(aggregate, 'temp', lodash.random(-4, 4))
    })

    let controller = makeController({
        'start': () => pm.start('main'),
        'stop': () => pm.stop('main')
    })

    return {
        aggregate,
        controller
    }
}