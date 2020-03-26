import React, { FunctionComponent } from 'react'
import { ActivityIndicator, Text, TextStyle, ViewStyle } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { colors, layout, typography } from '../../styles'
import { Touchable } from './touchable'

interface Props {
  label: string
  loading?: boolean
  small?: boolean
  style?: ViewStyle
  styleLabel?: TextStyle

  onPress: () => void
}

export const Button: FunctionComponent<Props> = ({
  label,
  loading,
  onPress,
  small,
  style,
  styleLabel
}) => {
  const styles = useDynamicStyleSheet(stylesheet)
  const color = useDynamicValue(colors.background)

  return (
    <Touchable
      disabled={loading}
      onPress={onPress}
      style={[styles.main, style, small && styles.small]}>
      {!loading && (
        <Text style={[styles.label, styleLabel, small && styles.smallLabel]}>
          {label}
        </Text>
      )}
      {loading && <ActivityIndicator color={color} size="small" />}
    </Touchable>
  )
}

const stylesheet = new DynamicStyleSheet({
  label: {
    ...typography.regular,
    ...typography.medium,
    color: colors.background
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: layout.radius,
    flexDirection: 'row',
    height: layout.button,
    justifyContent: 'center',
    paddingHorizontal: layout.margin
  },
  small: {
    height: layout.button * 0.75,
    paddingHorizontal: layout.margin * 0.75
  },
  smallLabel: {
    ...typography.small
  }
})
