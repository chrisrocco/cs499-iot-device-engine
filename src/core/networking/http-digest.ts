import {Subject} from "rxjs"
import express from 'express'
import {IIOTDeviceRegistry} from "../registry/Registry";
import {AggregateEvent} from "../aggregate/types";
const axios = require('axios')


export const HTTPDigestModule = (env) => (registry: IIOTDeviceRegistry) => {

    const commands$ = new Subject()

    const app = express()
    app.use(express.json())


    // Publish all events onto node-red flow
    registry.events$.subscribe((deviceEvent: AggregateEvent) => {
        axios.post(`${env.PUBLISH_COMMANDS_ENDPOINT}`, deviceEvent)
            .then(reply => null)
            .catch(error => console.log('could not dispatch to node-red'))
    })


    // consume commands
    app.post('/device-commands', (req, res) => {
        let command = req.body
        commands$.next(req.body)
        registry.handle(command)
            .then(reply => res.json({reply}))
            .catch(error => res.status(400).json({error}))
    })


    // Healthcheck Endpoint
    app.get('/ping', (_, res) => res.send('pong'))


    // export the Express app
    return {
        app,
        commands$
    }
}
