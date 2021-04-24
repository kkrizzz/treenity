import { Application } from '@feathersjs/express';

export function emailSubscribeRoute(app: Application) {
  app.collection('subscribes');

  app.post('/solarea/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
      const ip = req.headers['x-forwarded-for'];

      if (!ip) throw new Error('no ip');
      if (!email) throw new Error('no email');
      if (!/\S+@\S+\.\S+/.test(email)) throw new Error('validation error');

      const service = app.service('subscribes');

      if ((await service.find({ query: { ip } }))[0]) throw new Error('this ip already subscribed');
      if ((await service.find({ query: { email } }))[0]) {
        throw new Error('this email already subscribed');
      }

      await service.create({ email, ip, timestamp: new Date() });
      res.status(200).send('OK');
    } catch (e) {
      res.status(401).send(e.toString());
    }
  });
}
