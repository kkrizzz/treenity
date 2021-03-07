import { useEffect } from 'react';
import { types } from 'mobx-state-tree';
import { addComponent } from '../../treenity/context/context-db';
import { meta } from '../../treenity/meta/meta.model';
import {useApp} from "../../treenity/react/useApp";
import mongoService from 'feathers-mongodb';
import search from 'feathers-mongodb-fuzzy-search'
import createClientDb from "../mongo/mongod";

const RestServiceMeta = meta('rest.service', types.model({
  baseUrl: types.string,
  collectionName: types.string,
  whitelist: types.array(types.string),
  allowedFields: types.array(types.string)
}));

addComponent(RestServiceMeta, 'service', {}, ({ value }) => {
  const app = useApp();
  const db = createClientDb(app);

  useEffect(() => {
    console.log('starting rest service on', value.baseUrl);
    db.then(db => {
      app.use(value.baseUrl, mongoService({
        Model: db.collection(value.collectionName),
        whitelist: value.whitelist
      }));

      app.service(value.baseUrl).hooks({
        before: {
          find: [
            search({
              fields: value.allowedFields
            })
          ]
        }
      })
    });

    return () => undefined;
  }, [value.baseUrl]);

  return null;
});
