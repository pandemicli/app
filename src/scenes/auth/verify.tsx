import { NavigationProp, RouteProp } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, Message, TextBox } from '../../components/common'
import { useUser } from '../../hooks'
import { i18n } from '../../i18n'
import { AuthParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'Verify'>
  route: RouteProp<AuthParamList, 'Verify'>
}

export const Verify: FunctionComponent<Props> = ({
  route: {
    params: { backupPassword, newUser }
  }
}) => {
  const { bottom } = useSafeArea()

  const { errors, verify, verifying } = useUser()

  const [code, setCode] = useState('')

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        {
          paddingBottom: bottom + layout.margin
        }
      ]}>
      {errors.verify && (
        <Message message={errors.verify} style={styles.item} type="error" />
      )}
      <TextBox
        keyboardType="number-pad"
        onChangeText={(code) => setCode(code)}
        placeholder={i18n.t('label__code')}
        returnKeyType="done"
        style={styles.item}
        value={code}
      />
      <Button
        label={i18n.t('label__verify')}
        loading={verifying}
        onPress={() => {
          if (code) {
            verify(code, newUser, backupPassword)
          }
        }}
      />
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  item: {
    marginBottom: layout.margin
  },
  main: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: layout.margin
  }
})
