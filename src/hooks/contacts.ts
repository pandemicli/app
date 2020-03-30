import { useMutation, useQuery } from '@apollo/react-hooks'
import set from 'immutability-helper'
import { clone, cloneDeep, orderBy } from 'lodash'
import { useEffect, useState } from 'react'
import { SwipeRow } from 'react-native-swipe-list-view'

import {
  ADD_CONTACT,
  CONTACTS,
  CREATE_CONTACT,
  REMOVE_CONTACT,
  SYNC_CONTACTS,
  TOGGLE_FAVORITE_CONTACT,
  UPDATE_CONTACT
} from '../graphql/documents'
import {
  MutationAddContactPayload,
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
  MutationAddContactArgs,
  MutationCreateContactArgs,
  MutationRemoveContactArgs,
  MutationSyncContactsArgs,
  MutationToggleFavoriteContactArgs,
  MutationUpdateContactArgs,
  QueryContactsArgs
} from '../graphql/types'
import { i18n } from '../i18n'
import { crypto, dialog } from '../lib'
import { PhoneContact } from '../types'

export const useContacts = (date?: string) => {
  const [contacts, setContacts] = useState<Contact[]>([])

  const { data, loading, refetch } = useQuery<
    QueryContactsPayload,
    QueryContactsArgs
  >(CONTACTS, {
    variables: {
      date
    }
  })

  useEffect(() => {
    !(async () => {
      if (data?.contacts) {
        const raw = cloneDeep(data.contacts)

        const contacts = await Promise.all(
          raw.map(async (contact) => {
            contact.name = crypto.decrypt(contact.name)

            if (contact.phone) {
              contact.phone = crypto.decrypt(contact.phone)
            }

            return contact
          })
        )

        const sorted = orderBy(contacts, ['favorite', 'name'], ['desc', 'asc'])

        setContacts(sorted)
      }
    })()
  }, [data])

  return {
    contacts,
    loading,
    refetch
  }
}

export const useContactActions = () => {
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

  const [addContact, addContactMutation] = useMutation<
    MutationAddContactPayload,
    MutationAddContactArgs
  >(ADD_CONTACT, {
    async onCompleted({ addContact: { name, phone } }) {
      const yes = await dialog.confirm(
        i18n.t('lib__dialog__confirm__add_contact__message', {
          name
        }),
        i18n.t('lib__dialog__confirm__add_contact__title'),
        true
      )

      if (yes) {
        create({
          name,
          phone
        })
      }
    }
  })

  const create = async (
    data: ContactInput,
    callback?: (contact: Contact) => void
  ) => {
    const contact = clone(data)

    contact.name = crypto.encrypt(contact.name)

    if (contact.phone) {
      contact.phoneHash = await crypto.hash(contact.phone)
      contact.phone = crypto.encrypt(contact.phone)
    }

    createContact({
      async update(proxy, response) {
        if (!response.data) {
          return
        }

        // in case user never went to the contacts screen
        // and the contacts query was never run
        try {
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
        } catch (error) {}

        if (callback) {
          const contact = clone(response.data.createContact)

          contact.name = crypto.decrypt(contact.name)

          if (contact.phone) {
            contact.phone = crypto.decrypt(contact.phone)
          }

          callback(contact)
        }
      },
      variables: {
        contact
      }
    })
  }

  const update = async (id: string, data: ContactInput) => {
    const contact = clone(data)

    contact.name = crypto.encrypt(contact.name)

    if (contact.phone) {
      contact.phone = crypto.encrypt(contact.phone)
    }

    updateContact({
      variables: {
        contact,
        id
      }
    })
  }

  const remove = async (id: string, row: SwipeRow<Contact>) => {
    const yes = await dialog.confirm(
      i18n.t('lib__dialog__confirm__remove_contact')
    )

    if (yes) {
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

  const sync = async (data: PhoneContact[]) => {
    const contacts = await Promise.all(
      cloneDeep(data).map(async (contact) => {
        contact.name = crypto.encrypt(contact.name)

        if (contact.phone) {
          contact.phoneHash = await crypto.hash(contact.phone)
          contact.phone = crypto.encrypt(contact.phone)
        }

        contact.deviceId = await crypto.hash(contact.deviceId)

        return contact
      })
    )

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
  }

  const add = (code: string) =>
    addContact({
      variables: {
        code
      }
    })

  return {
    add,
    adding: addContactMutation.loading,
    create,
    creating: createContactMutation.loading,
    errors: {
      adding: addContactMutation.error,
      creating: createContactMutation.error,
      favoriting: toggleFavoriteContactMutation.error,
      removing: removeContactMutation.error,
      syncing: syncContactsMutation.error,
      updating: updateContactMutation.error
    },
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
