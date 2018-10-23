import {ProcessManager} from "../process-manager/types";
import {CommandHandlers} from "./types";

export const startStopControls = (process_key, pm: ProcessManager): CommandHandlers => ({
    'start': () => pm.start(process_key),
    'stop': () => pm.stop(process_key)
})