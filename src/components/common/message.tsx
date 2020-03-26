import React, { FunctionComponent } from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { colors, layout, typography } from '../../styles'

interface Props {
  message: string
  style?: ViewStyle
  type?: 'message' | 'error' | 'success'
}

export const Message: FunctionComponent<Props> = ({
  message,
  style,
  type = 'message'
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        style,
        type === 'error' && styles.error,
        type === 'success' && styles.success
      ]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  error: {
    backgroundColor: colors.state.error
  },
  main: {
    backgroundColor: colors.state.message,
    borderRadius: layout.radius,
    padding: layout.padding
  },
  message: {
    ...typography.footnote,
    ...typography.medium,
    color: colors.foreground
  },
  success: {
    backgroundColor: colors.state.success
  }
})
