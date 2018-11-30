import {AggregateCommand, Controller} from "../controller/types";
import {Aggregate, AggregateEvent, AggregateStateEvent} from "../aggregate/types";
import {Observable, Subject} from "rxjs";


export interface IOTDevice {
    aggregate: Aggregate
    controller: Controller
}

export interface DeviceCreatedEvent {
    aggregate_id: string
    key: "created"
    payload: {
        id: string
        meta: any
        state: any
    }
}