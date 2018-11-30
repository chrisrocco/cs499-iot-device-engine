import {Aggregate} from "../core/aggregate/types";
import {makeAggregate} from "../core/aggregate/Aggregate";
import {makeProcessManager} from "../core/process-manager/ProcessManager";
import {IOTDevice} from "../core/registry/types";
import {makeController} from "../core/controller/Controller";
import {dispatch} from "../core/actions";


export const makeSinkDevice = (id, meta = {}): IOTDevice => {

    let initial = {
        on: false,
        usage: 0
    }

    let reducers = {
        'on': (state) => ({ ...state, on: true }),
        'off': (state) => ({ ...state, on: false, usage: 0 }),
        'usage': (state, event) => ({ ...state, usage: event.payload.water_usage })
    }

    const aggregate: Aggregate = makeAggregate(initial, reducers)(id, meta)

    const pm = makeProcessManager({
        'main': ({ dt }) => {
            dispatch(aggregate, 'usage', { water_usage: dt })
        }
    })

    const controller = makeController({
        'on': (command) => {
            pm.start('main')
            dispatch(aggregate, 'on')
            return { msg: 'Turned on sink' }
        },
        'off': (command) => {
            pm.stop('main')
            dispatch(aggregate, 'off')
            return { msg: 'Turned off sink' }
        }
    })

    return {
        aggregate,
        controller
    }
}