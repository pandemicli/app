import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
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
  Refresher,
  Separator,
  Touchable
} from '../../components/common'
import { Filter } from '../../components/today'
import { PLACES } from '../../graphql/documents'
import { QueryPlacesPayload } from '../../graphql/payload'
import { QueryPlacesArgs } from '../../graphql/types'
import { useToggleCheckIn } from '../../hooks'
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
  const { data, loading, refetch } = useQuery<
    QueryPlacesPayload,
    QueryPlacesArgs
  >(PLACES, {
    variables: {
      date
    }
  })

  const { toggleCheckIn, togglingCheckIn } = useToggleCheckIn(date)

  const [query, setQuery] = useState('')

  const styles = useDynamicStyleSheet(stylesheet)
  const checked = useDynamicValue(
    img_dark_check_checked,
    img_light_check_checked
  )
  const unchecked = useDynamicValue(
    img_dark_check_unchecked,
    img_light_check_unchecked
  )
  const spinner = useDynamicValue(colors.foreground)

  const places = data?.places.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <FlatList
      data={places}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={
        <View style={styles.footer}>
          <Button
            label="Add more places"
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
            <ActivityIndicator color={spinner} style={styles.icon} />
          ) : (
            <Touchable onPress={() => toggleCheckIn(item.id)}>
              <Image
                source={item.checkedInToday ? checked : unchecked}
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
