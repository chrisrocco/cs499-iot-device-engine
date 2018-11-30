import {makeAggregate} from "../core/aggregate/Aggregate";
import {makeProcessManager} from "../core/process-manager/ProcessManager";
import {makeController} from "../core/controller/Controller";
import {startStopControls} from "../core/controller/mixins";
import {dispatch} from "../core/actions";


const initialState = {
    cooling: false,
    heating: false,
}


const reducers = {
    'cool': () => ({ cooling: true, heating: false }),
    'heat': () => ({ heating: true, cooling: false }),
    'off': () => ({ cooling: false, heating: false })
}


export const makeHvacDevice = (id, meta = {}) => {

    let aggregate = makeAggregate(initialState, reducers)(id, meta)

    let processManager = makeProcessManager({
        'main': () => {
            let state = aggregate.state$.value
            if(state.cooling || state.heating) {
                dispatch(aggregate, 'usage', {
                    power_usage: +(Math.random() * 100).toFixed()
                })
            }
        }
    })

    let controller = makeController({
        'cool': () => dispatch(aggregate, 'cool'),
        'off': () => dispatch(aggregate, 'off'),
        'heat': () => dispatch(aggregate, 'heat'),
        ...startStopControls('main', processManager)
    })

    return {
        aggregate,
        controller,
    }
}
