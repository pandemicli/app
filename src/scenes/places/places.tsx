import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { Text } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { SwipeListView } from 'react-native-swipe-list-view'

import { Refresher, Separator } from '../../components/common'
import { ListActions, ListEmpty, ListItem } from '../../components/places'
import { PLACES } from '../../graphql/documents'
import { QueryPlacesPayload } from '../../graphql/payload'
import { usePlaces } from '../../hooks'
import { PlacesParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<PlacesParamList, 'Places'>
  route: RouteProp<PlacesParamList, 'Places'>
}

export const Places: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const { data, loading, refetch } = useQuery<QueryPlacesPayload>(PLACES)

  const { favoriting, remove, removing, toggleFavorite } = usePlaces()

  const styles = useDynamicStyleSheet(stylesheet)

  const places = orderBy(data?.places, ['favorite', 'name'], ['desc', 'asc'])

  return (
    <SwipeListView
      closeOnRowBeginSwipe
      contentContainerStyle={styles.list}
      data={places}
      disableLeftSwipe
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.id}
      leftOpenValue={layout.icon * 3 + layout.margin * 3 * 2}
      ListEmptyComponent={<ListEmpty onPress={() => navigate('AddPlace')} />}
      ListFooterComponent={
        places.length > 0 ? (
          <>
            <Separator />
            <Text style={styles.message}>
              Swipe right to view more options for a place.
            </Text>
          </>
        ) : null
      }
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
      renderHiddenItem={({ item }, map) => (
        <ListActions
          favoriting={favoriting}
          onEdit={() => {
            navigate('EditPlace', {
              place: item
            })

            map[item.id].closeRow()
          }}
          onFavorite={() => toggleFavorite(item.id, map[item.id])}
          onRemove={() => remove(item.id, map[item.id])}
          removing={removing}
        />
      )}
      renderItem={({ item }) => <ListItem item={item} />}
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  list: {
    flexGrow: 1
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    margin: layout.margin,
    textAlign: 'center'
  }
})
