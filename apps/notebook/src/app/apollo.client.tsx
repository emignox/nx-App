import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql', // Cambia l'URL con l'endpoint del tuo GraphQL server
  }),
  cache: new InMemoryCache(),
});

export default client;