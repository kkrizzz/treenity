import { useEffect } from 'react';
import { types } from 'mobx-state-tree';
import { addComponent } from '../../treenity/context/context-db';
import { meta } from '../../treenity/meta/meta.model';
import { json } from 'body-parser';
import cors from 'cors';

const express = require('express');

const RestServiceMeta = meta('rest.service', types.model({
  baseUrl: types.string,
  collectionName: types.string,
}));

addComponent(RestServiceMeta, 'service', {}, ({ value, app }) => {
  useEffect(() => {
    const baseUrl = value.baseUrl;
    const app = express();
    app.use(json());
    app.use(cors('*'));
    const collection = app.service(value.collectionName);

    app.get(value.baseUrl, (req, res) => {

    });
    app.get(value.baseUrl, (req, res) => {

    });
  }, []);
});
