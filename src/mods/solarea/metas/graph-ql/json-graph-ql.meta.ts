import fetch from 'node-fetch';
import { types } from 'mobx-state-tree';
import useAsyncEffect from 'use-async-effect';
import jsonGraphqlExpress from 'json-graphql-server';

import { meta } from '../../../../treenity/meta/meta.model';
import { addComponent } from '../../../../treenity/context/context-db';
import { useApp } from '../../../../treenity/react/useApp';

export const JsonGraphQlMeta = meta(
  'json-graphql',
  types.model({
    jsonUrl: types.string,
    baseUrl: types.string,
  }),
);

addComponent(JsonGraphQlMeta, 'service', {}, ({ value }) => {
  const app = useApp();

  useAsyncEffect(async () => {
    console.log('starting rest service on', value.baseUrl);

    const request = await fetch(value.jsonUrl);
    const json = await request.json();

    app.use(value.baseUrl, jsonGraphqlExpress({ tokens: json.tokens }));

    return () => undefined;
  }, [value.baseUrl]);

  return null;
});
