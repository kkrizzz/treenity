import { Application } from '@feathersjs/express';
import fetch from 'node-fetch';

const strParams = (obj) =>
  Object.keys(obj)
    .map(function (key) {
      return key + '=' + obj[key];
    })
    .join('&');

export async function klinesProxy(app: Application) {
  app.get('/solarea/klines2', async (req, res) => {
    try {
      if (Object.keys(req.query).length < 4) res.status(400).send();

      const data = await fetch(`http://3.8.240.68/api/klines2?${strParams(req.query)}`);
      const klines = await data.json();
      res.status(200).send(klines);
    } catch (e) {
      res.status(500).send();
    }
  });
}
