export default interface IComponentQuery {
  _id: string;
  componentID: string;

  query: string;
  name: string;
  endpoint_url: string;
  variables: unknown;
}
