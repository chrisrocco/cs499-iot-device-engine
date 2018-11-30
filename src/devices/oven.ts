import {makeAggregate} from "../core/aggregate/Aggregate";
import {makeController} from "../core/controller/Controller";
import {action} from "../core/actions";
import {makeProcessManager} from "../core/process-manager/ProcessManager";


export const makeOvenDevice = (id, meta = {}) => {

    let aggregate = makeAggregate({ on: false }, {
        'on': () => ({on: true}),
        'off': () => ({on: false})
    })(id, meta)


    let pm = makeProcessManager({
        'main': () => {
            aggregate.events$.next({
                key: 'usage',
                payload: {
                    gas_usage: 30
                }
            })
        }
    })


    let controller = makeController({
        'on': () => {
            pm.start('main')
            aggregate.events$.next(action('on'))
        },
        'off': () => {
            pm.stop('main')
            aggregate.events$.next(action('off'))
        }
    })


    return {
        aggregate,
        controller
    }
}