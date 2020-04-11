import { useMutation, useQuery } from '@apollo/react-hooks'
import set from 'immutability-helper'
import { clone, cloneDeep, orderBy } from 'lodash'
import { useEffect, useState } from 'react'

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
import { crypto, dialog, errors } from '../lib'

export const usePlaces = (date?: string) => {
  const [decrypting, setDecrypting] = useState(true)
  const [places, setPlaces] = useState<Place[]>([])

  const { data, loading, refetch } = useQuery<
    QueryPlacesPayload,
    QueryPlacesArgs
  >(PLACES, {
    onError(error) {
      errors.handleApollo(error)
    },
    variables: {
      date
    }
  })

  useEffect(() => {
    !(async () => {
      if (data?.places) {
        setDecrypting(true)

        const places = await Promise.all(
          cloneDeep(data.places).map(async (place) => {
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
        setDecrypting(false)
      }
    })()
  }, [data])

  return {
    loading: decrypting || loading,
    places,
    refetch
  }
}

export const usePlaceActions = () => {
  const [favoriting, setFavoriting] = useState(new Map())

  const [createPlace, createPlaceMutation] = useMutation<
    MutationCreatePlacePayload,
    MutationCreatePlaceArgs
  >(CREATE_PLACE, {
    onError(error) {
      errors.handleApollo(error)
    }
  })

  const [updatePlace, updatePlaceMutation] = useMutation<
    MutationUpdatePlacePayload,
    MutationUpdatePlaceArgs
  >(UPDATE_PLACE, {
    onError(error) {
      errors.handleApollo(error)
    }
  })

  const [removePlace, removePlaceMutation] = useMutation<
    MutationRemovePlacePayload,
    MutationRemovePlaceArgs
  >(REMOVE_PLACE, {
    onError(error) {
      errors.handleApollo(error)
    }
  })

  const [toggleFavoritePlace, toggleFavoritePlaceMutation] = useMutation<
    MutationToggleFavoritePlacePayload,
    MutationToggleFavoritePlaceArgs
  >(TOGGLE_FAVORITE_PLACE, {
    onError(error) {
      errors.handleApollo(error)

      setFavoriting(new Map())
    }
  })

  const create = async (data: PlaceInput, callback: (place: Place) => void) => {
    const place = clone(data)

    place.name = await crypto.encrypt(place.name)

    if (place.latitude) {
      place.latitude = await crypto.encrypt(place.latitude)
    }

    if (place.longitude) {
      place.longitude = await crypto.encrypt(place.longitude)
    }

    if (place.googlePlaceId) {
      place.googlePlaceIdHash = await crypto.hash(place.googlePlaceId)
      place.googlePlaceId = await crypto.encrypt(place.googlePlaceId)
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

        callback(place)
      },
      variables: {
        place
      }
    })
  }

  const update = async (id: string, data: PlaceInput) => {
    const place = clone(data)

    place.name = await crypto.encrypt(place.name)

    if (place.latitude) {
      place.latitudeHash = await crypto.hash(place.latitude)
      place.latitude = await crypto.encrypt(place.latitude)
    }

    if (place.longitude) {
      place.longitudeHash = await crypto.hash(place.longitude)
      place.longitude = await crypto.encrypt(place.longitude)
    }

    if (place.googlePlaceId) {
      place.googlePlaceIdHash = await crypto.hash(place.googlePlaceId)
      place.googlePlaceId = await crypto.encrypt(place.googlePlaceId)
    }

    updatePlace({
      variables: {
        id,
        place
      }
    })
  }

  const remove = async (id: string, callback: () => void) => {
    const yes = await dialog.confirm(i18n.t('dialog__confirm__remove_place'))

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

        callback()
      },
      variables: {
        id
      }
    })
  }

  const toggleFavorite = (id: string) => {
    const next = new Map(favoriting)

    next.set(id, true)

    setFavoriting(next)

    toggleFavoritePlace({
      update(proxy, response) {
        const next = new Map(favoriting)

        next.delete(id)

        setFavoriting(next)

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
      },
      variables: {
        id
      }
    })
  }

  return {
    create,
    creating: createPlaceMutation.loading,
    errors: {
      creating: createPlaceMutation.error,
      removing: removePlaceMutation.error,
      toggling: toggleFavoritePlaceMutation.error,
      updating: updatePlaceMutation.error
    },
    favoriting,
    remove,
    removing: removePlaceMutation.loading,
    toggleFavorite,
    update,
    updating: updatePlaceMutation.loading
  }
}
