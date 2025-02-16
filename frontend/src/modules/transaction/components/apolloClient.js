import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_BASE_URL+'/graphql', // URL ของ Strapi GraphQL
  cache: new InMemoryCache(),
});

export { client, gql };
