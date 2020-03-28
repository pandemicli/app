import React, { FunctionComponent } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
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
import { Contact, Place } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Image, Touchable } from '../common'

interface Props {
  item: Contact | Place
  loading: boolean

  onPress: () => void
}

export const FeedItem: FunctionComponent<Props> = ({
  item,
  loading,
  onPress
}) => {
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

  return item.__typename === 'Contact' ? (
    <View style={styles.main}>
      <Text style={styles.name}>{item.name}</Text>
      {loading ? (
        <ActivityIndicator color={spinner} style={styles.icon} />
      ) : (
        <Touchable onPress={onPress}>
          <Image
            source={item.interactedToday ? checked : unchecked}
            style={styles.icon}
          />
        </Touchable>
      )}
    </View>
  ) : item.__typename === 'Place' ? (
    <View style={styles.main}>
      <Text style={styles.name}>{item.name}</Text>
      {loading ? (
        <ActivityIndicator color={spinner} style={styles.icon} />
      ) : (
        <Touchable onPress={onPress}>
          <Image
            reverse={false}
            source={item.checkedInToday ? checked : unchecked}
            style={styles.icon}
          />
        </Touchable>
      )}
    </View>
  ) : null
}

const stylesheet = new DynamicStyleSheet({
  icon: {
    height: layout.icon,
    margin: layout.margin,
    width: layout.icon
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
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
