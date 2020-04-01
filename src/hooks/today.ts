import { useQuery } from '@apollo/react-hooks'
import { cloneDeep, orderBy } from 'lodash'
import { useEffect, useState } from 'react'

import { TODAY_FEED } from '../graphql/documents'
import { QueryTodayFeedPayload } from '../graphql/payload'
import { Contact, Place, QueryTodayFeedArgs, Symptom } from '../graphql/types'
import { crypto } from '../lib'

export const useToday = (date: string) => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  const { data, loading, refetch } = useQuery<
    QueryTodayFeedPayload,
    QueryTodayFeedArgs
  >(TODAY_FEED, {
    variables: {
      date
    }
  })

  useEffect(() => {
    !(async () => {
      if (data?.todayFeed.contacts) {
        const raw = cloneDeep(data.todayFeed.contacts)

        const contacts = raw.map((contact) => {
          contact.name = crypto.decrypt(contact.name)

          if (contact.phone) {
            contact.phone = crypto.decrypt(contact.phone)
          }

          return contact
        })

        const sorted = orderBy(contacts, ['favorite', 'name'], ['desc', 'asc'])

        setContacts(sorted)
      }

      if (data?.todayFeed.places) {
        const raw = cloneDeep(data.todayFeed.places)

        const places = raw.map((place) => {
          place.name = crypto.decrypt(place.name)

          if (place.latitude) {
            place.latitude = crypto.decrypt(place.latitude)
          }

          if (place.longitude) {
            place.longitude = crypto.decrypt(place.longitude)
          }

          if (place.googlePlaceId) {
            place.googlePlaceId = crypto.decrypt(place.googlePlaceId)
          }

          return place
        })

        const sorted = orderBy(places, ['favorite', 'name'], ['desc', 'asc'])

        setPlaces(sorted)
      }

      if (data?.todayFeed.symptoms) {
        const symptoms = cloneDeep(data.todayFeed.symptoms)

        setSymptoms(symptoms)
      }
    })()
  }, [data])

  return {
    contacts,
    loading,
    places,
    refetch,
    symptoms
  }
}
