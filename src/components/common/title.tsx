import React, { FunctionComponent, ReactChild } from 'react'
import { Image, ImageSourcePropType, Text, View, ViewStyle } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { colors, layout } from '../../styles'
import { Touchable } from './touchable'

interface Action {
  icon: ImageSourcePropType

  onPress: () => void
}

interface Props {
  actions?: Action[]
  aside?: ReactChild
  style?: ViewStyle
  title: string
}

export const Title: FunctionComponent<Props> = ({
  actions,
  aside,
  style,
  title
}) => {
  const { top } = useSafeArea()

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        style,
        {
          paddingTop: top + layout.margin
        }
      ]}>
      <Text style={styles.title}>{title}</Text>
      {actions && (
        <View style={styles.actions}>
          {actions.map(({ icon, onPress }, index) => (
            <Touchable key={index} onPress={onPress}>
              <Image source={icon} style={styles.icon} />
            </Touchable>
          ))}
        </View>
      )}
      {aside}
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  actions: {
    flexDirection: 'row'
  },
  icon: {
    height: layout.icon,
    margin: layout.padding,
    width: layout.icon
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: layout.margin
  },
  title: {
    color: colors.primary,
    flex: 1,
    fontSize: 40,
    fontWeight: '600'
  }
})
