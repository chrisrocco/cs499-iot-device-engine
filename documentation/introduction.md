# Device Engine Documentation


### Representation of a Device
The device model:
```ts
interface Device {
    id: string              // an identifier for the device
    meta: {
        title: string       // a descriptive title for display
        type: string        // what kind of devices this is
    }
    state: any              // the state of the device
}
```

### Device State Changes
When the state of a device changes, an event is emitted:
```ts
interface DeviceStateEvent {
    id: string              // the id of the device
    state: any              // the state of the device
}
```

### Device Commands
Commands can be issued to devices via the API:
```ts
interface DeviceCommand {
    device_id: string
    timestamp: string
    key: string
    payload?: any
}
```

### Internal Device Events
Devices only change their internal state in response to events:
```ts
/**
 *  An event dispatched to the device.
 */
interface DeviceEvent {
    device_id: string
    timestamp: string
    key: string
    payload?: any
}
```

Users do not directly apply events to the device. Instead, they issue a command which gets validated and executed by a device controller. The controller then dispatches any corresponding events to the device to change its state.