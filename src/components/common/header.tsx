import { StackHeaderProps } from '@react-navigation/stack'
import React, { FunctionComponent, ReactChild } from 'react'
import { Animated, Image, ImageSourcePropType, Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_dark_back, img_light_back } from '../../assets'
import { colors, layout, typography } from '../../styles'
import { Touchable } from './touchable'

interface Props {
  left?: ReactChild
  right?: ReactChild
}

export const Header: FunctionComponent<Props & StackHeaderProps> = ({
  left,
  navigation: { goBack },
  previous,
  right,
  scene: {
    descriptor: {
      options: { title }
    },
    progress: { current, next }
  }
}) => {
  const { top } = useSafeArea()

  const styles = useDynamicStyleSheet(stylesheet)
  const back = useDynamicValue(img_dark_back, img_light_back)

  const opacity = Animated.add(current, next ? next : 0).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0]
  })

  return (
    <Animated.View
      style={[
        styles.main,
        {
          opacity,
          paddingTop: top + layout.margin
        }
      ]}>
      {(previous || left) && (
        <View style={styles.left}>
          {previous && (
            <Touchable onPress={goBack}>
              <Image source={back} style={styles.icon} />
            </Touchable>
          )}
          {left}
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {right && <View style={styles.right}>{right}</View>}
    </Animated.View>
  )
}

interface HeaderButtonProps {
  icon: ImageSourcePropType

  onPress: () => void
}

export const HeaderButton: FunctionComponent<HeaderButtonProps> = ({
  icon,
  onPress
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <Touchable onPress={onPress}>
      <Image source={icon} style={styles.icon} />
    </Touchable>
  )
}

const stylesheet = new DynamicStyleSheet({
  icon: {
    height: layout.icon,
    margin: layout.margin,
    width: layout.icon
  },
  left: {
    bottom: 0,
    flexDirection: 'row',
    left: -layout.margin,
    marginLeft: layout.margin,
    position: 'absolute'
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    padding: layout.margin
  },
  right: {
    bottom: 0,
    flexDirection: 'row',
    marginRight: layout.margin,
    position: 'absolute',
    right: -layout.margin
  },
  title: {
    ...typography.regular,
    ...typography.medium,
    color: colors.primary
  }
})
