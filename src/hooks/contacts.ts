import { useMutation, useQuery } from '@apollo/react-hooks'
import update from 'immutability-helper'
import { SwipeRow } from 'react-native-swipe-list-view'

import {
  CONTACTS,
  REMOVE_CONTACT,
  SYNC_CONTACTS,
  TOGGLE_FAVORITE_CONTACT
} from '../graphql/documents'
import {
  MutationRemoveContactPayload,
  MutationSyncContactsPayload,
  MutationToggleFavoriteContactPayload,
  QueryContactsPayload
} from '../graphql/payload'
import {
  Contact,
  MutationRemoveContactArgs,
  MutationSyncContactsArgs,
  MutationToggleFavoriteContactArgs
} from '../graphql/types'
import { PhoneContact } from '../types'

export const useContacts = () => {
  const { data, loading, refetch } = useQuery<QueryContactsPayload>(CONTACTS)

  const [syncContacts, syncContactsMutation] = useMutation<
    MutationSyncContactsPayload,
    MutationSyncContactsArgs
  >(SYNC_CONTACTS, {
    awaitRefetchQueries: true,
    refetchQueries() {
      return [
        {
          query: CONTACTS
        }
      ]
    }
  })

  const [removeContact, removeContactMutation] = useMutation<
    MutationRemoveContactPayload,
    MutationRemoveContactArgs
  >(REMOVE_CONTACT)
  const [toggleFavoriteContact, toggleFavoriteContactMutation] = useMutation<
    MutationToggleFavoriteContactPayload,
    MutationToggleFavoriteContactArgs
  >(TOGGLE_FAVORITE_CONTACT)

  const sync = (contacts: PhoneContact[]) =>
    syncContacts({
      awaitRefetchQueries: true,
      refetchQueries() {
        return [
          {
            query: CONTACTS
          }
        ]
      },
      variables: {
        contacts
      }
    })

  const remove = (id: string, row: SwipeRow<Contact>) =>
    removeContact({
      update(proxy) {
        const previous = proxy.readQuery<QueryContactsPayload>({
          query: CONTACTS
        })

        if (previous) {
          const index = previous.contacts.findIndex(
            (contact) => contact.id === id
          )

          proxy.writeQuery({
            data: update(previous, {
              contacts: {
                $splice: [[index, 1]]
              }
            }),
            query: CONTACTS
          })
        }

        row.closeRow()
      },
      variables: {
        id
      }
    })

  const toggleFavorite = (id: string, row: SwipeRow<Contact>) =>
    toggleFavoriteContact({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        const previous = proxy.readQuery<QueryContactsPayload>({
          query: CONTACTS
        })

        if (previous) {
          const index = previous.contacts.findIndex(
            (contact) => contact.id === id
          )

          proxy.writeQuery({
            data: update(previous, {
              contacts: {
                [index]: {
                  favorite: {
                    $set: response.data.toggleFavoriteContact
                  }
                }
              }
            }),
            query: CONTACTS
          })
        }

        row.closeRow()
      },
      variables: {
        id
      }
    })

  return {
    data,
    favoriting: toggleFavoriteContactMutation.loading,
    loading,
    refetch,
    remove,
    removing: removeContactMutation.loading,
    sync,
    syncing: syncContactsMutation.loading,
    toggleFavorite
  }
}
