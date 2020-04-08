import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import {
  SectionList,
  SectionListData,
  SectionListRenderItem,
  Text
} from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Refresher, Separator } from '../../components/common'
import { ListEmpty, ListItem } from '../../components/places'
import { Place } from '../../graphql/types'
import { usePlaceActions, usePlaces } from '../../hooks'
import { i18n } from '../../i18n'
import { analytics } from '../../lib'
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
  const { favoriting, toggleFavorite } = usePlaceActions()

  const styles = useDynamicStyleSheet(stylesheet)

  const favorites = places.filter(({ favorite }) => favorite)
  const others = places.filter(({ favorite }) => !favorite)

  const sections: SectionListData<Place>[] = []

  if (favorites.length > 0) {
    sections.push({
      data: favorites,
      key: i18n.t('title__favorites')
    })
  }

  if (others.length > 0) {
    sections.push({
      data: others,
      key: i18n.t('title__others')
    })
  }

  const renderItem: SectionListRenderItem<Place> = ({ item }) => (
    <ListItem
      favoriting={favoriting.get(item.id)}
      item={item}
      onEdit={() =>
        navigate('EditPlace', {
          place: item
        })
      }
      onFavorite={() => {
        toggleFavorite(item.id)

        analytics.track(item.favorite ? 'Place Unfavorited' : 'Place Favorited')
      }}
    />
  )

  return (
    <SectionList
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={<ListEmpty onPress={() => navigate('AddPlace')} />}
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
      removeClippedSubviews
      renderItem={renderItem}
      renderSectionHeader={({ section }) =>
        section.data.length > 0 ? (
          <Text style={styles.header}>{section.key}</Text>
        ) : null
      }
      sections={sections}
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
  }
})
