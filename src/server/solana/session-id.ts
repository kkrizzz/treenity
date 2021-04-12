import { Application } from '@feathersjs/express'
import { randomId } from "../../common/random-id";
import {Transaction} from "@solana/web3.js";

export function sessionIdRoute(app: Application) {
    app.post('/solarea/sessionid', async (req, res) => {
        const sid = randomId(24);

        await app.services.session.create({pubkey: req.body.pubkey, sid, timestamp: new Date()});
        res.send(sid);
    })

    app.post('/solarea/validate', async (req, res) => {
        try{
            const tx = req.body.transaction;
            if (!tx) throw Error('No transaction')

            const transaction = Transaction.from(tx.data);

            if (!transaction.feePayer) throw Error('No fee payer')

            if (!transaction.verifySignatures()) throw Error('Validation error')
            const pubkey = transaction.feePayer.toBase58();
            const sid = transaction.instructions[0].data.toString();
            const session = (await app.service('session').find({ query: { pubkey, sid } }))[0];
            if(!session) throw Error('Something went wrong');

            await app.services.session.patch(session._id, {
                ...session,
                valid: true,
            })

            return res.status(200).send('Validated');
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e)
        }
    })
}