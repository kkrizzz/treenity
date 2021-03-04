import { useEffect } from 'react';
import { types } from 'mobx-state-tree';
import { addComponent } from '../../treenity/context/context-db';
import { meta } from '../../treenity/meta/meta.model';
import {useApp} from "../../treenity/react/useApp";
import mongoService from 'feathers-mongodb';
import createClientDb from "../mongo/mongod";

const RestServiceMeta = meta('rest.service', types.model({
  baseUrl: types.string,
  collectionName: types.string,
}));

addComponent(RestServiceMeta, 'service', {}, ({ value }) => {
  const app = useApp();
  const db = createClientDb(app);

  useEffect(() => {
    db.then(db => {
      app.use(value.baseUrl, mongoService({
        Model: db.collection(value.collectionName),
      }))
    })

    return () => undefined
  }, []);

  return null;
});
