import { useMutation, useQuery } from '@apollo/react-hooks'
import update from 'immutability-helper'
import { SwipeRow } from 'react-native-swipe-list-view'

import {
  PLACES,
  REMOVE_PLACE,
  TOGGLE_FAVORITE_PLACE
} from '../graphql/documents'
import {
  MutationRemovePlacePayload,
  MutationToggleFavoritePlacePayload,
  QueryPlacesPayload
} from '../graphql/payload'
import {
  MutationRemovePlaceArgs,
  MutationToggleFavoritePlaceArgs,
  Place
} from '../graphql/types'

export const usePlaces = () => {
  const { data, loading, refetch } = useQuery<QueryPlacesPayload>(PLACES)

  const [removePlace, removePlaceMutation] = useMutation<
    MutationRemovePlacePayload,
    MutationRemovePlaceArgs
  >(REMOVE_PLACE)
  const [toggleFavoritePlace, toggleFavoritePlaceMutation] = useMutation<
    MutationToggleFavoritePlacePayload,
    MutationToggleFavoritePlaceArgs
  >(TOGGLE_FAVORITE_PLACE)

  const remove = (id: string, row: SwipeRow<Place>) =>
    removePlace({
      update(proxy) {
        const previous = proxy.readQuery<QueryPlacesPayload>({
          query: PLACES
        })

        if (previous) {
          const index = previous.places.findIndex((place) => place.id === id)

          proxy.writeQuery({
            data: update(previous, {
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
            data: update(previous, {
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
    data,
    favoriting: toggleFavoritePlaceMutation.loading,
    loading,
    refetch,
    remove,
    removing: removePlaceMutation.loading,
    toggleFavorite
  }
}
