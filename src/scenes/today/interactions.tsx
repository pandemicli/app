import { useQuery } from '@apollo/react-hooks'
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
import { CONTACTS } from '../../graphql/documents'
import { QueryContactsPayload } from '../../graphql/payload'
import { QueryContactsArgs } from '../../graphql/types'
import { useToggleInteraction } from '../../hooks'
import { i18n } from '../../i18n'
import { TodayParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<TodayParamList, 'Interactions'>
  route: RouteProp<TodayParamList, 'Interactions'>
}

export const Interactions: FunctionComponent<Props> = ({
  navigation: { navigate, push },
  route: {
    params: { date }
  }
}) => {
  const { data, loading, refetch } = useQuery<
    QueryContactsPayload,
    QueryContactsArgs
  >(CONTACTS, {
    variables: {
      date
    }
  })

  const { toggleInteraction, togglingInteraction } = useToggleInteraction(date)

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

  const contacts = data?.contacts.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <FlatList
      data={contacts}
      ItemSeparatorComponent={Separator}
      ListFooterComponent={
        <View style={styles.footer}>
          <Button
            label={i18n.t('label__add_more_contacts')}
            onPress={() => {
              navigate('Contacts')

              setTimeout(() => push('AddContact'))
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
          {togglingInteraction.get(item.id) ? (
            <ActivityIndicator color={spinner} style={styles.icon} />
          ) : (
            <Touchable onPress={() => toggleInteraction(item.id)}>
              <Image
                reverse={false}
                source={item.interactedToday ? checked : unchecked}
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
