export default interface IComponentQuery {
  _id: string;
  componentID: string;

  query: string;
  name: string;
  endpointURL: string;
  variables: unknown;
}
