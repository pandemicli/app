import { useMutation, useQuery } from '@apollo/react-hooks'
import set from 'immutability-helper'
import { clone, cloneDeep, orderBy } from 'lodash'
import { useEffect, useState } from 'react'
import { SwipeRow } from 'react-native-swipe-list-view'

import {
  CREATE_PLACE,
  PLACES,
  REMOVE_PLACE,
  TOGGLE_FAVORITE_PLACE,
  UPDATE_PLACE
} from '../graphql/documents'
import {
  MutationCreatePlacePayload,
  MutationRemovePlacePayload,
  MutationToggleFavoritePlacePayload,
  MutationUpdatePlacePayload,
  QueryPlacesPayload
} from '../graphql/payload'
import {
  MutationCreatePlaceArgs,
  MutationRemovePlaceArgs,
  MutationToggleFavoritePlaceArgs,
  MutationUpdatePlaceArgs,
  Place,
  PlaceInput,
  QueryPlacesArgs
} from '../graphql/types'
import { i18n } from '../i18n'
import { crypto, dialog } from '../lib'

export const usePlaces = (date?: string) => {
  const [places, setPlaces] = useState<Place[]>([])

  const { data, loading, refetch } = useQuery<
    QueryPlacesPayload,
    QueryPlacesArgs
  >(PLACES, {
    variables: {
      date
    }
  })

  useEffect(() => {
    !(async () => {
      if (data?.places) {
        const raw = cloneDeep(data.places)

        const places = await Promise.all(
          raw.map(async (place) => {
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
        )

        const sorted = orderBy(places, ['favorite', 'name'], ['desc', 'asc'])

        setPlaces(sorted)
      }
    })()
  }, [data])

  return {
    loading,
    places,
    refetch
  }
}

export const usePlaceActions = () => {
  const [createPlace, createPlaceMutation] = useMutation<
    MutationCreatePlacePayload,
    MutationCreatePlaceArgs
  >(CREATE_PLACE)

  const [updatePlace, updatePlaceMutation] = useMutation<
    MutationUpdatePlacePayload,
    MutationUpdatePlaceArgs
  >(UPDATE_PLACE)

  const [removePlace, removePlaceMutation] = useMutation<
    MutationRemovePlacePayload,
    MutationRemovePlaceArgs
  >(REMOVE_PLACE)

  const [toggleFavoritePlace, toggleFavoritePlaceMutation] = useMutation<
    MutationToggleFavoritePlacePayload,
    MutationToggleFavoritePlaceArgs
  >(TOGGLE_FAVORITE_PLACE)

  const create = async (data: PlaceInput, callback: (place: Place) => void) => {
    const place = clone(data)

    place.name = crypto.encrypt(place.name)

    if (place.latitude) {
      place.latitudeHash = await crypto.hash(place.latitude)
      place.latitude = crypto.encrypt(place.latitude)
    }

    if (place.longitude) {
      place.longitudeHash = await crypto.hash(place.longitude)
      place.longitude = crypto.encrypt(place.longitude)
    }

    if (place.googlePlaceId) {
      place.googlePlaceIdHash = await crypto.hash(place.googlePlaceId)
      place.googlePlaceId = crypto.encrypt(place.googlePlaceId)
    }

    createPlace({
      async update(proxy, response) {
        if (!response.data) {
          return
        }

        const previous = proxy.readQuery<QueryPlacesPayload>({
          query: PLACES
        })

        if (previous) {
          proxy.writeQuery({
            data: set(previous, {
              places: {
                $push: [response.data.createPlace]
              }
            }),
            query: PLACES
          })
        }

        const place = clone(response.data.createPlace)

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

        callback(place)
      },
      variables: {
        place
      }
    })
  }

  const update = async (id: string, data: PlaceInput) => {
    const place = clone(data)

    place.name = crypto.encrypt(place.name)

    if (place.latitude) {
      place.latitudeHash = await crypto.hash(place.latitude)
      place.latitude = crypto.encrypt(place.latitude)
    }

    if (place.longitude) {
      place.longitudeHash = await crypto.hash(place.longitude)
      place.longitude = crypto.encrypt(place.longitude)
    }

    if (place.googlePlaceId) {
      place.googlePlaceIdHash = await crypto.hash(place.googlePlaceId)
      place.googlePlaceId = crypto.encrypt(place.googlePlaceId)
    }

    updatePlace({
      variables: {
        id,
        place
      }
    })
  }

  const remove = async (id: string, row: SwipeRow<Place>) => {
    const yes = await dialog.confirm(
      i18n.t('lib__dialog__confirm__remove_place')
    )

    if (!yes) {
      return
    }

    removePlace({
      update(proxy) {
        const previous = proxy.readQuery<QueryPlacesPayload>({
          query: PLACES
        })

        if (previous) {
          const index = previous.places.findIndex((place) => place.id === id)

          proxy.writeQuery({
            data: set(previous, {
              places: {
                $splice: [[index, 1]]
              }
            }),
            query: PLACES
          })
        }

        row.closeRow()
      },
      variables: {
        id
      }
    })
  }

  const toggleFavorite = (id: string, row: SwipeRow<Place>) =>
    toggleFavoritePlace({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        const previous = proxy.readQuery<QueryPlacesPayload>({
          query: PLACES
        })

        if (previous) {
          const index = previous.places.findIndex((place) => place.id === id)

          proxy.writeQuery({
            data: set(previous, {
              places: {
                [index]: {
                  favorite: {
                    $set: response.data.toggleFavoritePlace
                  }
                }
              }
            }),
            query: PLACES
          })
        }

        row.closeRow()
      },
      variables: {
        id
      }
    })

  return {
    create,
    creating: createPlaceMutation.loading,
    errors: {
      creating: createPlaceMutation.error,
      removing: removePlaceMutation.error,
      toggling: toggleFavoritePlaceMutation.error,
      updating: updatePlaceMutation.error
    },
    favoriting: toggleFavoritePlaceMutation.loading,
    remove,
    removing: removePlaceMutation.loading,
    toggleFavorite,
    update,
    updating: updatePlaceMutation.loading
  }
}
