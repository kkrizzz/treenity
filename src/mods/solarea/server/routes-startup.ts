import { Application } from '@feathersjs/express';
import { prettierFormat } from './prettier';
import { emailSubscribeRoute } from './email-subscribe';
import { klinesProxy } from './klines-proxy';
import { nearIndexer } from './near-indexer';
import { nearPortfolio } from './near-portfolio';
import { currentPrice } from './near-portfolio/current-price';
import './near-portfolio/ref-finance-tokens';
import { indexRefFinanceTokensPrice } from './near-portfolio/ref-finance-tokens';
import { indexVelasDextools } from './velas-dextools/index';
import { graphqlEditor } from './graphql-editor';

export function routesStartup(app: Application) {
  prettierFormat(app);
  emailSubscribeRoute(app);
  klinesProxy(app);
  nearIndexer(app);
  indexRefFinanceTokensPrice(app);
  indexVelasDextools(app);
  graphqlEditor(app);
}
