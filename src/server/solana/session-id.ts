import { Application } from '@feathersjs/express'
import { randomId } from "../../common/random-id";

export function sessionIdRoute(app: Application) {
    app.post('/solarea/sessionid', async (req, res) => {
        const sid = randomId(24);

        await app.services.session.create({pubkey: req.body.pubkey, sid, timestamp: new Date()});
        res.send(sid);
    })
}