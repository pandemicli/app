import { useMutation } from '@apollo/react-hooks'
import update from 'immutability-helper'

import { PROFILE, TOGGLE_COVID19_POSITIVE } from '../graphql/documents'
import {
  MutationToggleCovid19PositivePayload,
  QueryProfilePayload
} from '../graphql/payload'
import { User } from '../graphql/types'

export const useToggleStatus = () => {
  const [toggleStatus, { loading }] = useMutation<
    MutationToggleCovid19PositivePayload
  >(TOGGLE_COVID19_POSITIVE)

  const toggle = (key: string, callback: (user: User) => void) =>
    toggleStatus({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        const previous = proxy.readQuery<QueryProfilePayload>({
          query: PROFILE
        })

        if (previous) {
          const profile = update(previous.profile, {
            covid19Positive: {
              $set: response.data.toggleCovid19Positive
            }
          })

          proxy.writeQuery({
            data: {
              profile
            },
            query: PROFILE
          })

          callback(profile)
        }
      }
    })

  return {
    loading,
    toggle
  }
}
