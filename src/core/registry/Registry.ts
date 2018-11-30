import {IOTDevice, DeviceCreatedEvent} from "./types";
import {AggregateCommand} from "../controller/types";
import {AggregateEvent, AggregateStateEvent} from "../aggregate/types";
import {Observable, Subject} from "rxjs";
import {connectAggregateEvents, connectAggregateState} from "./connectStreams";

type DeviceTable = {
    [id: string]: IOTDevice
}

export interface IIOTDeviceRegistry {
    get: (id: string) => IOTDevice
    all: () => IOTDevice[]
    events$: Subject<AggregateEvent>
    state$: Observable<AggregateStateEvent>
    handle: (command: AggregateCommand) => Promise<any>
    event: (event: AggregateEvent) => void
    registerDevice: (device: IOTDevice) => void
}


export const makeRegistry = (): IIOTDeviceRegistry => {

    // Streams representing all of the device events and state
    const events$ = new Subject<AggregateEvent>()
    const state$ = new Subject<AggregateStateEvent>()
    const table: DeviceTable = {}

    /**
     * Dispatch a command to some IOTDevice
     * within the registry
     * ==========================================
     * @param command
     */
    const handle = (command: AggregateCommand) => new Promise((res, rej) => {
        if(!table[command.aggregate_id])
            return rej(`Unknown aggregate ${command.aggregate_id}`)
        if(!command.payload)
            command.payload = {}
        return table[command.aggregate_id].controller.handle(command)
            .then(res, rej)
    })

    /**
     * Dispatches an event to a device in this registry.
     * Performs device lookup, applying directly to aggregate.
     * ==========================================================
     * @param event
     */
    const event = (event: AggregateEvent) => {
        if(!table[event.aggregate_id])
            return
        table[event.aggregate_id].aggregate.events$.next(event)
    }


    /**
     * Adds a new device to this registry,
     * emitting a device-created event
     * =========================================
     * @param device
     */
    const registerDevice = (device: IOTDevice) => {
        connectAggregateEvents(events$)(device.aggregate)
        connectAggregateState(state$)(device.aggregate)
        table[device.aggregate.id] = device

        let event: DeviceCreatedEvent = {
            aggregate_id: device.aggregate.id,
            key: 'created',
            payload: {
                id: device.aggregate.id,
                meta: device.aggregate.meta,
                state: device.aggregate.state$.value
            }
        }
        events$.next(event)
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
        event,
        registerDevice
    }
}