import {makeAggregate} from "../src/core/aggregate/Aggregate";
import {makeController} from "../src/core/controller/Controller";
import {makeProcessManager} from "../src/core/process-manager/ProcessManager";
import {action, dispatch} from "../src/core/actions";

// 1. Dispatch the handle event
// 2. Controller starts 'main' process
// 3. ProcessManager dispatches the on event
// 4. Aggregate reduces on event
// 5. Finish after first event, checking the state is as expected
test('ProcessManager module', (done) => {

    // Aggregate
    let initialState = {usage: 0}
    let reducers = {
        'usage': (state, event) => ({usage: event.payload})
    }
    let aggregate = makeAggregate(initialState, reducers)('my-id')

    // Process Manager
    let pm = makeProcessManager({
        'main': ({dt}) => dispatch(aggregate, 'usage', 2018)
    })

    // Controller
    let ctrl = makeController({
        'on': (command) => {
            pm.start('main')
            return {msg: 'Device started'}
        }
    })


    aggregate.events$.subscribe(event => {
        expect(event.key).toBe('usage')
        expect(event.payload).toBe(2018)
        expect(aggregate.state$.value.usage).toBe(2018)
        done()
        pm.stop('main')
    })

    ctrl.handle(action('on'))
})