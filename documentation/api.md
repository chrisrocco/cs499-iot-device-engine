# Device Engine API

The HTTP API exposes a single endpoint: `/device-commands`

### Dispatching Device Commands
This endpoint is used to issue commands against a device
```
POST /device-commands
{
    key: string
    time?: any
    payload?: any
    aggregate_id: string
}
```

### Observing Device State Changes
State changes are published via HTTP POST to an endpoint specified in the environment. This could be a node-red server, a cloud-function, or a custom service.

They contain the following payload:
```ts
type StateChangeEvent = {
    key: 'state'            // identifies this event as a state-change event
    aggregate_id: string    // the device id
    payload: any            // the current state of the device
}
```