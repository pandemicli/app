import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { Platform } from 'react-native'
import { API_URI } from 'react-native-dotenv'

import { storage } from '../lib'

const uri = __DEV__
  ? Platform.select({
      android: API_URI.replace('localhost', '10.0.2.2'),
      ios: API_URI
    })
  : API_URI

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
  uri
})
