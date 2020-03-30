import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { SectionListData, Text } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { SwipeListView } from 'react-native-swipe-list-view'

import { Refresher, Separator } from '../../components/common'
import { ListActions, ListEmpty, ListItem } from '../../components/places'
import { Place } from '../../graphql/types'
import { usePlaceActions, usePlaces } from '../../hooks'
import { i18n } from '../../i18n'
import { PlacesParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<PlacesParamList, 'Places'>
  route: RouteProp<PlacesParamList, 'Places'>
}

export const Places: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const { loading, places, refetch } = usePlaces()
  const { favoriting, remove, removing, toggleFavorite } = usePlaceActions()

  const styles = useDynamicStyleSheet(stylesheet)

  const favorites = places.filter(({ favorite }) => favorite)
  const others = places.filter(({ favorite }) => !favorite)

  const sections: SectionListData<Place>[] = []

  if (favorites.length > 0) {
    sections.push({
      data: favorites,
      title: i18n.t('title__favorites')
    })
  }

  if (others.length > 0) {
    sections.push({
      data: others,
      title: i18n.t('title__others')
    })
  }

  return (
    <SwipeListView
      closeOnRowBeginSwipe
      contentContainerStyle={styles.list}
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
              {i18n.t('places__message__swipe')}
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
      renderSectionHeader={({ section }) =>
        section.data.length > 0 ? (
          <Text style={styles.header}>{section.title}</Text>
        ) : null
      }
      sections={sections}
      useSectionList
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  header: {
    ...typography.small,
    ...typography.medium,
    backgroundColor: colors.backgroundDark,
    color: colors.foregroundLight,
    flex: 1,
    padding: layout.margin
  },
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
