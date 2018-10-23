import {makeAggregate} from "../core/aggregate/Aggregate";
import {makeController} from "../core/controller/Controller";
import {action} from "../core/actions";

export const makeDoorDevice = (id, meta = {}) => {

    let aggregate = makeAggregate({open: false}, {
        'opened': () => ({open: true}),
        'closed': () => ({open: false})
    })(id, meta)

    let controller = makeController({
        'open': () => aggregate.events$.next(action('opened')),
        'close': () => aggregate.events$.next(action('closed'))
    })

    return {
        aggregate,
        controller
    }
}