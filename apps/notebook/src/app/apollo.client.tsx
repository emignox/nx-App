import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Retrieve the JWT token from localStorage
const token = localStorage.getItem('token');

// Configure the HTTP link
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Configure the WebSocket link using graphql-ws
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/graphql',
  connectionParams: {
    authToken: token ? `Bearer ${token}` : "",
  },
}));

// Use `split` to route HTTP and WebSocket requests
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default client;
