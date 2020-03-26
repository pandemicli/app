import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { colors, layout, typography } from '../../styles'
import { Button } from '../common'

interface Props {
  onPress: () => void
}

export const ListEmpty: FunctionComponent<Props> = ({ onPress }) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.empty}>
      <Text style={styles.message}>
        You haven't added any places right now.
      </Text>
      <Button label="Add place" onPress={onPress} />
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  empty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  list: {
    flexGrow: 1
  },
  message: {
    ...typography.regular,
    color: colors.foreground,
    marginBottom: layout.margin
  }
})
