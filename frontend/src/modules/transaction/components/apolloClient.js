import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:1337/graphql', // URL ของ Strapi GraphQL
  cache: new InMemoryCache(),
});

export { client, gql };
