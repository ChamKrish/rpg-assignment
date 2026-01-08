import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: 'http://localhost:3200/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3200/graphql',
    connectionParams: () => {
      const token = localStorage.getItem('token')
      return token ? { Authorization: `Bearer ${token}` } : {}
    },
  }),
)

const link = split(
  ({ query }) => {
    const op = getMainDefinition(query)
    return op.kind === 'OperationDefinition' && op.operation === 'subscription'
  },
  wsLink,
  ApolloLink.from([authLink, httpLink]),
)

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})
