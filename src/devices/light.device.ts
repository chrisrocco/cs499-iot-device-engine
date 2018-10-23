import {Aggregate} from "../core/aggregate/types";
import {makeAggregate} from "../core/aggregate/Aggregate";
import {makeProcessManager} from "../core/process-manager/ProcessManager";
import {IOTDevice} from "../core/registry/types";
import {makeController} from "../core/controller/Controller";
import {action, dispatch} from "../core/actions";


export const makeLight = (id, meta = {}): IOTDevice => {

    let initial = {
        on: false,
        usage: 0
    }

    let reducers = {
        'on': (state) => ({ ...state, on: true }),
        'off': (state) => ({ ...state, on: false, usage: 0 }),
        'usage': (state, event) => ({ ...state, usage: event.payload.power_usage })
    }

    const aggregate: Aggregate = makeAggregate(initial, reducers)(id, meta)

    const pm = makeProcessManager({
        'main': ({ dt }) => dispatch(aggregate, 'usage', {
            power_usage: dt
        })
    })

    const controller = makeController({
        'on': (command) => {
            pm.start('main')
            dispatch(aggregate, 'on')
            return { msg: 'Turned on light' }
        },
        'off': (command) => {
            pm.stop('main')
            dispatch(aggregate, 'off')
            return { msg: 'Turned off light' }
        }
    })

    return {
        aggregate,
        controller
    }
}