import { Application } from '@feathersjs/express';
import { prettierFormat } from './prettier';
import { emailSubscribeRoute } from './email-subscribe';
import { klinesProxy } from './klines-proxy';
import { nearIndexer } from './near-indexer';
import { nearPortfolio } from './near-portfolio';
import { currentPrice } from './near-portfolio/current-price';
import './near-portfolio/ref-finance-tokens';
import { indexRefFinanceTokensPrice } from './near-portfolio/ref-finance-tokens';

export function routesStartup(app: Application) {
  prettierFormat(app);
  emailSubscribeRoute(app);
  klinesProxy(app);
  nearIndexer(app);
  indexRefFinanceTokensPrice(app);
  // nearPortfolio(app);
}
