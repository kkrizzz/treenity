import express, { Application } from '@feathersjs/express';
import config from '../../../../prettier.config';

import prettier from 'prettier';

export function prettierFormat(app: Application) {
  app.post('/solarea/prettier', express.json(), async (req, res) => {
    const code = req.body;

    if (!code.code) {
      res.status(400);
      res.end();
      return;
    }

    const formatted = prettier.format(code.code, config);

    res.send({ formatted });
    res.end();
  });
}
