import {Subject} from "rxjs"
import express from 'express'


const COMMANDS_ENDPOINT = '/device-commands'


export const HTTPDigestModule = (handleCommand) => {

    const commands$ = new Subject()

    const app = express()
    app.use(express.json())


    // consume commands
    app.post(COMMANDS_ENDPOINT, (req, res) => {
        let command = req.body
        commands$.next(req.body)
        handleCommand(command)
            .then(reply => res.json({reply}))
            .catch(error => res.status(400).json({error}))
    })

    // export the Express app
    return {
        app,
        commands$
    }
}
