import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { API_URI } from 'react-native-dotenv'

import { storage } from '../lib'

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  async request(operation) {
    const token = await storage.get('@token')

    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    }
  },
  uri: API_URI
})
