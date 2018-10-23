import { BehaviorSubject, Subject } from 'rxjs';
import { map, scan, filter } from 'rxjs/operators';
import {Aggregate, Event} from './types';

export const makeAggregate = (initialState, reducers) => (id, meta = {}): Aggregate => {

    // the stream where raw events are published to
    let events$ = new Subject<Event>()

    // the stream used to access (or watch) the current event state
    let state$ = new BehaviorSubject(initialState)

    // reduce the event stream into the current state
    events$.pipe(
        filter(event => !!reducers[event.key]),
        scan((currentState, event) => {
            let patch = changes => ({ ...currentState, ...changes })
            return reducers[event.key](currentState, event, { patch })
        }, initialState)
    ).subscribe(state$)

    // module exports
    return {
        id,
        meta,
        state$,
        events$,
    }
}

export const Aggregates = {
    new: makeAggregate
}