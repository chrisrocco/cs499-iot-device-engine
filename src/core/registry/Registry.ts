import {IOTDevice, IOTDeviceRegistry, DeviceCreatedEvent} from "./types";
import {AggregateCommand} from "../controller/types";
import {AggregateEvent, AggregateStateEvent} from "../aggregate/types";
import {Subject} from "rxjs";
import {connectAggregateEvents, connectAggregateState} from "./connectStreams";

type DeviceTable = {
    [id: string]: IOTDevice
}

export const makeRegistry = (devices: IOTDevice[]): IOTDeviceRegistry => {

    // Streams representing all of the device events and state
    let events$ = new Subject<AggregateEvent>()
    let state$ = new Subject<AggregateStateEvent>()

    // Compose the streams
    devices.map(D => D.aggregate).forEach(connectAggregateEvents(events$))
    devices.map(D => D.aggregate).forEach(connectAggregateState(state$))

    // Lookup table for devices by ID
    let table: DeviceTable = devices.reduce((table, device) => ({
        ...table,
        [device.aggregate.id]: device
    }), {})

    // Controller functions
    let handle = (command: AggregateCommand) => new Promise((res, rej) => {
        if(!table[command.aggregate_id])
            return rej(`Unknown aggregate ${command.aggregate_id}`)
        return table[command.aggregate_id].controller.handle(command)
            .then(res, rej)
    })

    let event = (event: AggregateEvent) => {
        if(!table[event.aggregate_id])
            return
        table[event.aggregate_id].aggregate.events$.next(event)
    }


    // Map state changes onto regular event stream
    // // Not sure if this is a good idea yet
    state$.subscribe((event: AggregateStateEvent) => events$.next({
        aggregate_id: event.aggregate_id,
        key: 'state',
        payload: event.state
    }))

    return {
        events$,
        state$,
        get: (id: string) => table[id],
        all: () => Object.values(table),
        handle,
        event
    }
}