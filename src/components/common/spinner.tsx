import React, { FunctionComponent } from 'react'
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native'

import { colors } from '../../styles'

interface Props {
  style?: ViewStyle
}

export const Spinner: FunctionComponent<Props> = ({ style }) => (
  <View style={[styles.main, style]}>
    <ActivityIndicator color={colors.accent} size="large" />
  </View>
)

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
})
