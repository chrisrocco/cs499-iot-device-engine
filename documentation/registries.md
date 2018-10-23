# Device Registry
The device registry enables working with multiple devices.

Key features of the DeviceRegistry module:
* Routes command events to the correct devices
* Aggregates multiple device state/event streams
* Inspect a collection of devices

The interface for the DeviceRegistry module:
```ts
interface IOTDeviceRegistry {
    get: (id: string) => IOTDevice
    all: () => IOTDevice[]
    events$: Subject<AggregateEvent>
    state$: Observable<AggregateStateEvent>
    handle: (command: AggregateCommand) => Promise<any>
    event: (event: AggregateEvent) => void
}

interface IOTDevice {
    aggregate: Aggregate
    controller: Controller
}
```

The registry published state changes as an event:
```ts
type StateEvent = {
    aggregate_id: string,
    key: 'state',
    payload: any
}
```