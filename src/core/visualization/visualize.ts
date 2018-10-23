import {IOTDeviceRegistry} from "../registry/types";
import {debounceTime, map} from "rxjs/operators";

export const stateTable = (registry: IOTDeviceRegistry) => registry.state$.pipe(
    debounceTime(50),
    map(() => registry.all()),
    map(devices => devices.map(device => device.aggregate)),
    map(aggregates => aggregates.map(A => ({
        name: A.meta.title,
        ...A.state$.value
    })))
)