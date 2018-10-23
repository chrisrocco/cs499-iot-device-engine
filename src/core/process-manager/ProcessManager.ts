import {Processes, ProcessManager} from "./types";

/**
 * 
 * @param processes - a set of process functions
 */
export const make = (processes: Processes): ProcessManager => {

    let running = {}

    let isRunning = (key) => !!running[key]

    let start = (key) => {
        if(isRunning(key)) return
        if(!processes[key]) throw "Tried to start unknown process, " + key

        // setup the initial process state
        running[key] = {
            timer: null,
            state: {},
            last_tick: +Date.now().toFixed()
        }

        // the function to run on an interval
        let fn = () => {
            let p = running[key] // fetch the process

            let now = +Date.now().toFixed()
            let dt = now - p.last_tick  // calculate time delta since last execution

            p.state = processes[key]({ now, dt, state: p.state })    // run the process function
            p.last_tick = now   // record this execution
        }

        running[key].timer = setInterval(fn, 2000)  // start the process
    }

    let stop = (key) => {
        if(!isRunning(key)) return
        clearInterval(running[key].timer)
        delete running[key]
    }

    return {
        start,
        stop,
        isRunning
    }
}

export const makeProcessManager = make

export const ProcessManagers = {
    new: make
}