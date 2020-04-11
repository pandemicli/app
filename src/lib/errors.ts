import * as Sentry from '@sentry/react-native'
import { ApolloError } from 'apollo-boost'

import { mitter } from './mitter'

class Errors {
  handleApi(error: Error) {
    mitter.error({
      body: error.message,
      title: 'API error',
      type: 'error'
    })

    Sentry.captureException(error)
  }

  handleApollo({ graphQLErrors, networkError }: ApolloError) {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        mitter.error({
          body: error.message,
          title: 'API error',
          type: 'error'
        })

        Sentry.captureException(error)
      })
    } else if (networkError) {
      mitter.error({
        body: networkError.message,
        title: 'Network error',
        type: 'error'
      })

      Sentry.captureException(networkError)
    }
  }
}

export const errors = new Errors()
