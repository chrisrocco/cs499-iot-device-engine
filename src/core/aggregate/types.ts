import {BehaviorSubject, Subject} from "rxjs";


export interface Event {
    key: string
    payload?: any
    time?: string | number
}

export interface AggregateEvent extends Event {
    aggregate_id: string
}

export interface AggregateStateEvent {
    aggregate_id: string
    state: any
}


export interface Aggregate {
    id: string
    meta?: any
    state$: BehaviorSubject<any>
    events$: Subject<Event>
}


export type AggregateReducer = (state: any, event: Event) => any

export interface AggregateReducers {
    [key: string]: AggregateReducer
}