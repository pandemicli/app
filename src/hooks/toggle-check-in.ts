import { useMutation } from '@apollo/react-hooks'
import update from 'immutability-helper'
import { useState } from 'react'

import { TODAY_FEED, TOGGLE_CHECK_IN } from '../graphql/documents'
import {
  MutationToggleCheckInPayload,
  QueryTodayFeedPayload
} from '../graphql/payload'
import { MutationToggleCheckInArgs, QueryTodayFeedArgs } from '../graphql/types'

export const useToggleCheckIn = (date: string) => {
  const [togglingCheckIn, setToggling] = useState(new Map())

  const updateToggling = (id: string, loading: boolean) => {
    const next = new Map(togglingCheckIn)

    next.set(id, loading)

    setToggling(next)
  }

  const [toggle] = useMutation<
    MutationToggleCheckInPayload,
    MutationToggleCheckInArgs
  >(TOGGLE_CHECK_IN)

  const toggleCheckIn = async (id: string) => {
    updateToggling(id, true)

    toggle({
      update(proxy, response) {
        updateToggling(id, false)

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
          const index = previousTodayFeed.todayFeed.places.findIndex(
            (place) => place.id === id
          )

          if (index >= 0) {
            const {
              data: { toggleCheckIn }
            } = response

            proxy.writeQuery({
              data: update(previousTodayFeed, {
                todayFeed: {
                  places: {
                    [index]: {
                      checkedInToday: {
                        $set: toggleCheckIn
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
        id
      }
    })
  }

  return {
    toggleCheckIn,
    togglingCheckIn
  }
}
