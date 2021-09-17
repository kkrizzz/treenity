import { Application } from '@feathersjs/express';
import { currentPrice } from './current-price';
import { indexPriceCron } from './index-price-cron';
const { Pool, Client } = require('pg');
const fetch = require('node-fetch');

export function nearPortfolio(app: Application) {
  currentPrice(app);
  indexPriceCron(app);
}
