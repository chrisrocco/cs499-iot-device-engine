import {CommandHandlers, Controller} from "./types";

export const makeController = (handlers: CommandHandlers): Controller => {

    let handle = ({ key, payload = {} }) =>
        new Promise((resolve, reject) => {
            if (!handlers[key]) {
                return reject({ msg: 'unknown command', key, payload })
            }

            let command = {key, payload, reject}

            resolve(handlers[key](command))
        })

    return {handle}
}

