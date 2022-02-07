import { graphqlEditorProxy } from './graphqlEditorProxy';
import { ObjectID } from 'mongodb';
import { Application } from '@feathersjs/express';

const ENDPOINTS_COLLECTION_NAME = 'graphql-editor-endpoints';
const QUERIES_COLLECTION_NAME = 'graphql-editor-queries';
const COMPONENT_QUERIES_COLLECTION_NAME = 'graphql-component-queries';

function graphqlEditorEndpoints(app: Application) {
  const endpointsCollection = app.services[ENDPOINTS_COLLECTION_NAME].Model;

  app.get('/solarea/graphql/endpoints', async (req, res) => {
    try {
      const endpoints = await endpointsCollection.find({}).toArray();
      res.send(endpoints);
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  });
}

function graphqlEditorQueries(app: Application) {
  const queriesCollection = app.services[QUERIES_COLLECTION_NAME].Model;

  app.get('/solarea/graphql/queries', async (req, res) => {
    try {
      const endpointID = req.query.endpoint;
      if (!endpointID) return res.status(400).send("Query parameter 'endpoint' is required");

      const queries = await queriesCollection.find({ endpointID }).toArray();
      res.send(queries);
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  });
}
function graphqlComponentQueries(app: Application) {
  const componentQueriesCollection = app.services[COMPONENT_QUERIES_COLLECTION_NAME].Model;

  app.get('/solarea/graphql/components/queries', async (req, res) => {
    try {
      const { componentID } = req.query;

      const queries = await componentQueriesCollection.find({ componentID }).toArray();
      res.send(queries);
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  });

  app.post('/solarea/graphql/components/queries', async (req, res) => {
    try {
      const { queryData, componentID } = req.body;
      if (queryData == null || typeof queryData !== 'object') return res.status(400).send();
      const { variables, endpoint_url, name, query } = queryData;

      await componentQueriesCollection.insertOne({
        componentID,
        variables,
        endpoint_url,
        name,
        query,
      });
      res.status(201).send();
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  });

  app.delete('/solarea/graphql/components/queries/:queryID', async (req, res) => {
    try {
      const r = await componentQueriesCollection.deleteOne({
        _id: ObjectID(req.params.queryID),
      });

      if (r.deletedCount) res.send(r);
      else res.status(404).send();
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  });
  app.patch('/solarea/graphql/components/queries/:queryID', async (req, res) => {
    try {
      const { variables, query } = req.body;
      const update: any = {};
      if (variables) update.variables = variables;
      if (query) update.query = query;

      await componentQueriesCollection.updateOne(
        { _id: ObjectID(req.params.queryID) },
        { $set: update },
      );

      res.status(204).send();
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
  });
}

export function graphqlEditor(app: any) {
  app.collection(ENDPOINTS_COLLECTION_NAME);
  app.collection(QUERIES_COLLECTION_NAME);
  app.collection(COMPONENT_QUERIES_COLLECTION_NAME);

  graphqlEditorProxy(app);
  graphqlEditorEndpoints(app);
  graphqlEditorQueries(app);
  graphqlComponentQueries(app);
}
