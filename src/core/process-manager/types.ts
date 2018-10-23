export type ProcessParams = {
    now: number
    dt: number
    state: any
}

export type Process = (params: ProcessParams) => any

export type Processes = {
    [key: string]: Process
}

export type ProcessManager = {
    start: (key: string) => void
    stop: (key: string) => void
    isRunning: (key: string) => boolean
}
