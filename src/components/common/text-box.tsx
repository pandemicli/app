import React, { forwardRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { colors, layout, typography } from '../../styles'

export const TextBox = forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    const styles = useDynamicStyleSheet(stylesheet)

    const color = useDynamicValue(colors.foregroundLight)

    return (
      <TextInput
        placeholderTextColor={color}
        ref={ref}
        style={[styles.main, style]}
        {...props}
      />
    )
  }
)

const stylesheet = new DynamicStyleSheet({
  main: {
    ...typography.regular,
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    color: colors.foreground,
    height: layout.textBox,
    paddingHorizontal: layout.margin
  }
})
