import {debounceTime, map} from "rxjs/operators";
import {IIOTDeviceRegistry} from "../registry/Registry";

export const stateTable = (registry: IIOTDeviceRegistry) => registry.state$.pipe(
    debounceTime(50),
    map(() => registry.all()),
    map(devices => devices.map(device => device.aggregate)),
    map(aggregates => aggregates.map(A => ({
        name: A.meta.title,
        ...A.state$.value
    })))
)