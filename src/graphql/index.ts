import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { Platform } from 'react-native'
import { API_URI } from 'react-native-dotenv'

import { mitter, storage } from '../lib'

const uri = __DEV__
  ? Platform.select({
      android: API_URI.replace('localhost', '10.0.2.2'),
      ios: API_URI
    })
  : API_URI

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  onError({ graphQLErrors }) {
    graphQLErrors?.forEach((error) => {
      if (error?.extensions?.code === 'UNAUTHENTICATED') {
        mitter.emit('logout')
      }
    })
  },
  async request(operation) {
    const token = await storage.get<string>('@token')

    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    }
  },
  uri
})
