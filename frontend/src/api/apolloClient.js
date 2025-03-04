import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import conf from "../conf/main"

const client = new ApolloClient({
  uri: conf.apiUrlPrefix+'/graphql', // URL ของ Strapi GraphQL
  cache: new InMemoryCache(),
});

export { client, gql };
