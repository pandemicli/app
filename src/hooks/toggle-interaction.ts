import { useMutation } from '@apollo/react-hooks'
import update from 'immutability-helper'
import { useState } from 'react'

import { TODAY_FEED, TOGGLE_INTERACTION } from '../graphql/documents'
import {
  MutationToggleInteractionPayload,
  QueryTodayFeedPayload
} from '../graphql/payload'
import {
  MutationToggleInteractionArgs,
  QueryTodayFeedArgs
} from '../graphql/types'
import { errors } from '../lib'

export const useToggleInteraction = (date: string) => {
  const [togglingInteraction, setToggling] = useState(new Map())

  const updateToggling = (id: string, loading: boolean) => {
    const next = new Map(togglingInteraction)

    next.set(id, loading)

    setToggling(next)
  }

  const [toggle] = useMutation<
    MutationToggleInteractionPayload,
    MutationToggleInteractionArgs
  >(TOGGLE_INTERACTION, {
    onError(error) {
      errors.handleApollo(error)

      setToggling(new Map())
    }
  })

  const toggleInteraction = async (id: string) => {
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
          const index = previousTodayFeed.todayFeed.contacts.findIndex(
            (contact) => contact.id === id
          )

          if (index >= 0) {
            proxy.writeQuery({
              data: update(previousTodayFeed, {
                todayFeed: {
                  contacts: {
                    [index]: {
                      interactedToday: {
                        $set: response.data.toggleInteraction
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
    toggleInteraction,
    togglingInteraction
  }
}
