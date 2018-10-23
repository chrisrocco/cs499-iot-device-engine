#### Aggregates
An aggregate is a combination of a JS object representing state and a set of pure reducer functions that calculate a new state in response to events.

The aggregate module bundles an initial state, some reducers, an ID, and optionally some meta-data together.

You can dispatch events to an aggregate and subscribe to state or telemetry events.

#### Process Managers
The ProcessManagers module allows you to define and execute IOT processes in a predictable way.

A **process function** is passed some data and state about the process and gets executed on an interval.

The process function will most likely be lexically bound to the aggregate object in order to dispatch events to it.

#### Controllers
Controllers validate user commands, dispatch events, and return a response within the context of a single aggregate.

They can start/stop processes, make HTTP request, etc.

#### Ingesting Commands and Events via HTTP API
The networking module in the core library provides functionality for spawning an HTTP web server to digest device events and commands.

The HTTPDigest module exports an express application and a stream of events and commands that you can map onto a registry

#### Device Registries
A registry makes it easy to work with a collection of IOT devices.

Adding devices to a registry enables treating them as a single stream enriched with an 'aggregate_id' property.

This makes it easy to make the events from a collection of devices onto another network like GCloud PubSub or Node-Red.
