import { useMutation } from '@apollo/react-hooks'
import update from 'immutability-helper'
import { useState } from 'react'

import { CONTACTS, TODAY_FEED, TOGGLE_INTERACTION } from '../graphql/documents'
import {
  MutationToggleInteractionPayload,
  QueryContactsPayload,
  QueryTodayFeedPayload
} from '../graphql/payload'
import {
  MutationToggleInteractionArgs,
  QueryContactsArgs,
  QueryTodayFeedArgs
} from '../graphql/types'

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
  >(TOGGLE_INTERACTION)

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
            const {
              data: { toggleInteraction }
            } = response

            proxy.writeQuery({
              data: update(previousTodayFeed, {
                todayFeed: {
                  contacts: {
                    [index]: {
                      interactedToday: {
                        $set: toggleInteraction
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

        // in case user never went to the contacts screen
        // and the contacts query was never run
        try {
          const previousContacts = proxy.readQuery<
            QueryContactsPayload,
            QueryContactsArgs
          >({
            query: CONTACTS,
            variables: {
              date
            }
          })

          if (previousContacts) {
            const index = previousContacts.contacts.findIndex(
              (contact) => contact.id === id
            )

            if (index >= 0) {
              const {
                data: { toggleInteraction }
              } = response

              proxy.writeQuery({
                data: update(previousContacts, {
                  contacts: {
                    [index]: {
                      interactedToday: {
                        $set: toggleInteraction
                      }
                    }
                  }
                }),
                query: CONTACTS
              })
            }
          }
        } catch (error) {}
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
