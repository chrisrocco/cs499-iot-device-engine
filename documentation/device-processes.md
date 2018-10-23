# Device Processes
Most devices will need some sort of living CPU process to do their jobs.

The ProcessManager module enables modeling a device process, managing its state, and provides an interface for staring, stopping, and inspecting the process.

For example, the light has a process that is started when the light gets turned on, and stopped when it gets turned off. While the process is running, it dispatches heartbeat events to the device at some interval. This event results in a state change of the device, which gets broadcast to a network where other services can consume this information.

A process is defined as follows:
* A process is just a function
* The manager runs the function on some interval, passing in params like he time elapsed since the last run, the state of the process, and the current time.
* The function is expected to return the new process state
* Each process has a name/key. The process manager is constructed with an object where the key is the process identifier, and the value is the process function
```ts
type ProcessParams = {
    now: number
    dt: number
    state: any
}

type Process = (params: ProcessParams) => any

type Processes = {
    [key: string]: Process
}
```
