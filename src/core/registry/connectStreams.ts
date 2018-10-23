import {Aggregate, AggregateEvent, AggregateStateEvent} from "../aggregate/types";
import {Subject} from "rxjs";

/**
 * Aggregate events usually only contain locally scoped information.
 * When we publish these events on the network, we need to enrich them with the aggregate_id.
 * That's what these functions are for: streaming the aggregate events onto a global aggregate event stream
 */

export const connectAggregateEvents =
    (events$: Subject<AggregateEvent>) =>
        (aggregate: Aggregate) => {
            aggregate.events$.subscribe(event => {
                events$.next({
                    aggregate_id: aggregate.id,
                    ...event
                })
            })
        }

export const connectAggregateState =
    (state$: Subject<AggregateStateEvent>) =>
        (aggregate: Aggregate) => {
            aggregate.state$.subscribe(state => {
                state$.next({
                    aggregate_id: aggregate.id,
                    state
                })
            })
        }
