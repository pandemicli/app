import { useQuery } from '@apollo/react-hooks'
import { cloneDeep, orderBy } from 'lodash'
import { useEffect, useState } from 'react'

import { TODAY_FEED } from '../graphql/documents'
import { QueryTodayFeedPayload } from '../graphql/payload'
import { Contact, Place, QueryTodayFeedArgs, Symptom } from '../graphql/types'
import { crypto, errors } from '../lib'

export const useToday = (date: string) => {
  const [decrypting, setDecrypting] = useState(true)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  const { data, loading, refetch } = useQuery<
    QueryTodayFeedPayload,
    QueryTodayFeedArgs
  >(TODAY_FEED, {
    onError(error) {
      errors.handleApollo(error)
    },
    variables: {
      date
    }
  })

  useEffect(() => {
    !(async () => {
      if (
        data?.todayFeed.contacts ||
        data?.todayFeed.places ||
        data?.todayFeed.symptoms
      ) {
        setDecrypting(true)

        if (data?.todayFeed.contacts) {
          const contacts = await Promise.all(
            cloneDeep(data.todayFeed.contacts).map(async (contact) => {
              contact.name = await crypto.decrypt(contact.name)

              if (contact.phone) {
                contact.phone = await crypto.decrypt(contact.phone)
              }

              return contact
            })
          )

          const sorted = orderBy(
            contacts,
            ['favorite', 'name'],
            ['desc', 'asc']
          )

          setContacts(sorted)
        }

        if (data?.todayFeed.places) {
          const places = await Promise.all(
            cloneDeep(data.todayFeed.places).map(async (place) => {
              place.name = await crypto.decrypt(place.name)

              if (place.latitude) {
                place.latitude = await crypto.decrypt(place.latitude)
              }

              if (place.longitude) {
                place.longitude = await crypto.decrypt(place.longitude)
              }

              if (place.googlePlaceId) {
                place.googlePlaceId = await crypto.decrypt(place.googlePlaceId)
              }

              return place
            })
          )

          const sorted = orderBy(places, ['favorite', 'name'], ['desc', 'asc'])

          setPlaces(sorted)
        }

        if (data?.todayFeed.symptoms) {
          const symptoms = cloneDeep(data.todayFeed.symptoms)

          setSymptoms(symptoms)
        }

        setDecrypting(false)
      }
    })()
  }, [data])

  return {
    contacts,
    loading: decrypting || loading,
    places,
    refetch,
    symptoms
  }
}
