import { StackHeaderProps } from '@react-navigation/stack'
import React, { FunctionComponent, ReactChild } from 'react'
import { Animated, Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import { Source } from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import {
  img_dark_back,
  img_dark_next,
  img_light_back,
  img_light_next
} from '../../assets'
import { colors, layout, typography } from '../../styles'
import { Image } from './image'
import { Touchable } from './touchable'

interface Props {
  left?: ReactChild
  right?: ReactChild

  onNext?: () => void
  onPrevious?: () => void
}

export const Header: FunctionComponent<Props & StackHeaderProps> = ({
  left,
  navigation: { goBack },
  onNext,
  onPrevious,
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
  const color_background = useDynamicValue('#f6f7f8', '#111')
  const img_back = useDynamicValue(img_dark_back, img_light_back)
  const img_next = useDynamicValue(img_dark_next, img_light_next)
  const img_previous = useDynamicValue(img_dark_back, img_light_back)

  const opacity = Animated.add(current, next ? next : 0).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0]
  })

  return (
    <Animated.View
      style={[
        styles.main,
        {
          backgroundColor: color_background,
          height: layout.header + top,
          opacity,
          paddingTop: top
        }
      ]}>
      {(previous || left) && (
        <View style={styles.left}>
          {previous && (
            <Touchable onPress={goBack}>
              <Image source={img_back} style={styles.icon} />
            </Touchable>
          )}
          {left}
        </View>
      )}
      {onPrevious && (
        <Touchable onPress={onPrevious}>
          <Image source={img_previous} style={styles.icon} />
        </Touchable>
      )}
      <Text style={styles.title}>{title}</Text>
      {onNext && (
        <Touchable onPress={onNext}>
          <Image source={img_next} style={styles.icon} />
        </Touchable>
      )}
      {right && <View style={styles.right}>{right}</View>}
    </Animated.View>
  )
}

interface HeaderButtonProps {
  icon: Source

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
    marginStart: layout.margin,
    position: 'absolute'
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderBottomColor: colors.border,
    borderBottomWidth: layout.border,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  right: {
    bottom: 0,
    flexDirection: 'row',
    marginEnd: layout.margin,
    position: 'absolute',
    right: -layout.margin
  },
  title: {
    ...typography.regular,
    ...typography.medium,
    color: colors.primary,
    margin: layout.margin
  }
})
