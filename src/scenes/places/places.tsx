import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { SwipeListView } from 'react-native-swipe-list-view'

import { Refresher, Separator } from '../../components/common'
import { ListActions, ListEmpty, ListItem } from '../../components/places'
import { usePlaces } from '../../hooks'
import { PlacesParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<PlacesParamList, 'Places'>
  route: RouteProp<PlacesParamList, 'Places'>
}

export const Places: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const {
    data,
    favoriting,
    loading,
    refetch,
    remove,
    removing,
    toggleFavorite
  } = usePlaces()

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <SwipeListView
      closeOnRowBeginSwipe
      contentContainerStyle={styles.list}
      data={orderBy(data?.places, ['favorite', 'name'], ['desc', 'asc'])}
      disableLeftSwipe
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.id}
      leftOpenValue={layout.icon * 3 + layout.margin * 3 * 2}
      ListEmptyComponent={<ListEmpty onPress={() => navigate('AddPlace')} />}
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
  }
})
