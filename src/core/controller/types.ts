
export type CommandHandler = (command: any) => any

export type CommandHandlers = {
    [key: string]: CommandHandler
}

export interface Command {
    key: string
    time?: any
    payload?: any
}

export interface AggregateCommand extends Command {
    aggregate_id: string
}

export type Controller = {
    handle: (command: Command) => any
}