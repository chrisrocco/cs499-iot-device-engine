## Device Aggregate and Controller

Aggregates and Controllers are ideas from domain driven design.

#### The Aggregate Module
Essentially, the aggregate models the device and enforces data integrity. It is the source of truth for data about the device. Events get dispatched to the aggregate and it knows how the state should be changed in response

The Aggregate module:
```ts
export interface Aggregate {
    id: string
    meta?: any
    state$: BehaviorSubject<any>
    events$: Subject<Event>
}
```

#### The Controller Module
The controller handles user commands by validating requests and executing relevant operations. The controller can dispatch events to the aggregate. It is important to realize that the users can not dispatch events directly to the aggregate. Instead, they send commands to the controller, and the controller may dispatch some events while executing the commands

The Controller module:
```ts
export interface AggregateCommand {
    key: string
    time?: any
    payload?: any
    aggregate_id: string
}

export type Controller = {
    handle: (command: AggregateCommand) => any
}
```