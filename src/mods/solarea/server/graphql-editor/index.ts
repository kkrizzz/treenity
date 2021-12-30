import { graphqlEditorProxy } from './graphqlEditorProxy';
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
      const { queries, componentID } = req.body;
      if (queries == null || !Array.isArray(queries)) return res.status(400).send();

      for (let { _id, componentID: _, ...queryData } of queries) {
        if (_id != null)
          await componentQueriesCollection.updateOne({ componentID, _id }, { $set: queryData });
        else await componentQueriesCollection.insertOne({ componentID, ...queryData });
      }

      res.send();
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
