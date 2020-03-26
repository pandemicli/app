import React, { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { colors } from '../../styles'

export const Separator: FunctionComponent = () => {
  const styles = useDynamicStyleSheet(stylesheet)

  return <View style={styles.main} />
}

const stylesheet = new DynamicStyleSheet({
  main: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth
  }
})
