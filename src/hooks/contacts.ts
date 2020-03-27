import { useMutation } from '@apollo/react-hooks'
import set from 'immutability-helper'
import { SwipeRow } from 'react-native-swipe-list-view'

import {
  CONTACTS,
  CREATE_CONTACT,
  REMOVE_CONTACT,
  SYNC_CONTACTS,
  TOGGLE_FAVORITE_CONTACT,
  UPDATE_CONTACT
} from '../graphql/documents'
import {
  MutationCreateContactPayload,
  MutationRemoveContactPayload,
  MutationSyncContactsPayload,
  MutationToggleFavoriteContactPayload,
  MutationUpdateContactPayload,
  QueryContactsPayload
} from '../graphql/payload'
import {
  Contact,
  ContactInput,
  MutationCreateContactArgs,
  MutationRemoveContactArgs,
  MutationSyncContactsArgs,
  MutationToggleFavoriteContactArgs,
  MutationUpdateContactArgs
} from '../graphql/types'
import { dialog } from '../lib'
import { PhoneContact } from '../types'

export const useContacts = () => {
  const [createContact, createContactMutation] = useMutation<
    MutationCreateContactPayload,
    MutationCreateContactArgs
  >(CREATE_CONTACT)

  const [updateContact, updateContactMutation] = useMutation<
    MutationUpdateContactPayload,
    MutationUpdateContactArgs
  >(UPDATE_CONTACT)

  const [removeContact, removeContactMutation] = useMutation<
    MutationRemoveContactPayload,
    MutationRemoveContactArgs
  >(REMOVE_CONTACT)

  const [toggleFavoriteContact, toggleFavoriteContactMutation] = useMutation<
    MutationToggleFavoriteContactPayload,
    MutationToggleFavoriteContactArgs
  >(TOGGLE_FAVORITE_CONTACT)

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

  const create = (
    contact: ContactInput,
    callback: (contact: Contact) => void
  ) =>
    createContact({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        callback(response.data.createContact)

        const previous = proxy.readQuery<QueryContactsPayload>({
          query: CONTACTS
        })

        if (previous) {
          proxy.writeQuery({
            data: set(previous, {
              contacts: {
                $push: [response.data.createContact]
              }
            }),
            query: CONTACTS
          })
        }
      },
      variables: {
        contact
      }
    })

  const update = (id: string, contact: ContactInput) =>
    updateContact({
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
            data: set(previous, {
              contacts: {
                [index]: {
                  $set: response.data.updateContact
                }
              }
            }),
            query: CONTACTS
          })
        }
      },
      variables: {
        contact,
        id
      }
    })

  const remove = async (id: string, row: SwipeRow<Contact>) => {
    const yes = await dialog.confirm('Do you want to remove this contact?')

    if (!yes) {
      return
    }

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
            data: set(previous, {
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
  }

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
            data: set(previous, {
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

  return {
    create,
    creating: createContactMutation.loading,
    favoriting: toggleFavoriteContactMutation.loading,
    remove,
    removing: removeContactMutation.loading,
    sync,
    syncing: syncContactsMutation.loading,
    toggleFavorite,
    update,
    updating: updateContactMutation.loading
  }
}
