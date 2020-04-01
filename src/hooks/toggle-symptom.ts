import { useMutation } from '@apollo/react-hooks'
import update from 'immutability-helper'
import { useState } from 'react'

import { TODAY_FEED, TOGGLE_SYMPTOM } from '../graphql/documents'
import {
  MutationToggleSymptomPayload,
  QueryTodayFeedPayload
} from '../graphql/payload'
import {
  MutationToggleSymptomArgs,
  QueryTodayFeedArgs,
  SymptomName
} from '../graphql/types'

export const useToggleSymptom = (date: string) => {
  const [togglingSymptom, setToggling] = useState(new Map())

  const updateToggling = (id: string, loading: boolean) => {
    const next = new Map(togglingSymptom)

    next.set(id, loading)

    setToggling(next)
  }

  const [toggle] = useMutation<
    MutationToggleSymptomPayload,
    MutationToggleSymptomArgs
  >(TOGGLE_SYMPTOM)

  const toggleSymptom = async (name: SymptomName) => {
    updateToggling(name, true)

    toggle({
      update(proxy, response) {
        updateToggling(name, false)

        if (!response.data) {
          return
        }

        const previousTodayFeed = proxy.readQuery<
          QueryTodayFeedPayload,
          QueryTodayFeedArgs
        >({
          query: TODAY_FEED,
          variables: {
            date
          }
        })

        if (previousTodayFeed) {
          const index = previousTodayFeed.todayFeed.symptoms.findIndex(
            (symptom) => symptom.name === name
          )

          if (index >= 0) {
            proxy.writeQuery({
              data: update(previousTodayFeed, {
                todayFeed: {
                  symptoms: {
                    [index]: {
                      experiencedToday: {
                        $set: response.data.toggleSymptom
                      }
                    }
                  }
                }
              }),
              query: TODAY_FEED,
              variables: {
                date
              }
            })
          }
        }
      },
      variables: {
        date,
        name
      }
    })
  }

  return {
    toggleSymptom,
    togglingSymptom
  }
}
