import {Aggregate} from "./aggregate/types";

// helper function for creating an action object
export const action = (key: string, payload = {}) => ({
    key,
    payload,
    time: (new Date()).toString()
})

// Helper function for applying an event to an aggregate
export const dispatch = (aggregate: Aggregate, key: string, payload = {}) =>
    aggregate.events$.next(action(key, payload))