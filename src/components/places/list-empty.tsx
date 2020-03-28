import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { i18n } from '../../i18n'
import { colors, layout, typography } from '../../styles'
import { Button } from '../common'

interface Props {
  onPress: () => void
}

export const ListEmpty: FunctionComponent<Props> = ({ onPress }) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.main}>
      <Text style={styles.message}>
        {i18n.t('places__list__empty__message')}
      </Text>
      <Button
        label={i18n.t('places__list__empty__label')}
        onPress={onPress}
        small
      />
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: layout.margin * 2
  },
  message: {
    ...typography.regular,
    color: colors.foreground,
    marginBottom: layout.margin
  }
})
