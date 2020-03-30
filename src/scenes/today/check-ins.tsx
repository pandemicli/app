import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import {
  img_dark_check_checked,
  img_dark_check_unchecked,
  img_light_check_checked,
  img_light_check_unchecked
} from '../../assets'
import {
  Button,
  Image,
  Refresher,
  Separator,
  Touchable
} from '../../components/common'
import { Filter } from '../../components/today'
import { useToggleCheckIn } from '../../hooks'
import { usePlaces } from '../../hooks'
import { i18n } from '../../i18n'
import { TodayParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<TodayParamList, 'CheckIns'>
  route: RouteProp<TodayParamList, 'CheckIns'>
}

export const CheckIns: FunctionComponent<Props> = ({
  navigation: { navigate, push },
  route: {
    params: { date }
  }
}) => {
  const { loading, places, refetch } = usePlaces(date)

  const { toggleCheckIn, togglingCheckIn } = useToggleCheckIn(date)

  const [query, setQuery] = useState('')

  const styles = useDynamicStyleSheet(stylesheet)
  const color_spinner = useDynamicValue(colors.foreground)
  const img_checked = useDynamicValue(
    img_dark_check_checked,
    img_light_check_checked
  )
  const img_unchecked = useDynamicValue(
    img_dark_check_unchecked,
    img_light_check_unchecked
  )

  const data = places.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={
        <View style={styles.footer}>
          <Button
            label={i18n.t('label__add_more_places')}
            onPress={() => {
              navigate('Places')

              setTimeout(() => push('AddPlace'))
            }}
            small
          />
        </View>
      }
      ListHeaderComponent={
        <Filter onChange={(query) => setQuery(query)} query={query} />
      }
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          {togglingCheckIn.get(item.id) ? (
            <ActivityIndicator color={color_spinner} style={styles.icon} />
          ) : (
            <Touchable onPress={() => toggleCheckIn(item.id)}>
              <Image
                reverse={false}
                source={item.checkedInToday ? img_checked : img_unchecked}
                style={styles.icon}
              />
            </Touchable>
          )}
        </View>
      )}
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  footer: {
    alignItems: 'center',
    margin: layout.margin
  },
  icon: {
    height: layout.icon,
    margin: layout.margin,
    width: layout.icon
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  name: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground,
    flex: 1,
    margin: layout.margin
  }
})
