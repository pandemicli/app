import { useMutation } from '@apollo/react-hooks'
import set from 'immutability-helper'
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
  PlaceInput
} from '../graphql/types'
import { i18n } from '../i18n'
import { dialog } from '../lib'

export const usePlaces = () => {
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

  const create = (place: PlaceInput, callback: (place: Place) => void) =>
    createPlace({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        callback(response.data.createPlace)

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
      },
      variables: {
        place
      }
    })

  const update = (id: string, place: PlaceInput) =>
    updatePlace({
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
                  $set: response.data.updatePlace
                }
              }
            }),
            query: PLACES
          })
        }
      },
      variables: {
        id,
        place
      }
    })

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
