import { useMutation } from '@apollo/react-hooks'
import { NavigationProp } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, Message, TextBox } from '../../components/common'
import { VERIFY } from '../../graphql/documents'
import { MutationVerifyPayload } from '../../graphql/payload'
import { MutationVerifyArgs } from '../../graphql/types'
import { i18n } from '../../i18n'
import { AuthParamList } from '../../navigators'
import { useAuth } from '../../store'
import { layout } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'Verify'>
}

export const Verify: FunctionComponent<Props> = () => {
  const { bottom } = useSafeArea()

  const [, { signIn }] = useAuth()

  const [code, setCode] = useState('')

  const [verify, { error, loading }] = useMutation<
    MutationVerifyPayload,
    MutationVerifyArgs
  >(VERIFY, {
    onCompleted({
      verify: {
        token,
        user: { id }
      }
    }) {
      signIn(id, token)
    },
    variables: {
      code
    }
  })

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        {
          paddingBottom: bottom + layout.margin
        }
      ]}>
      {error && (
        <Message message={error.message} style={styles.item} type="error" />
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
        loading={loading}
        onPress={() => {
          if (code) {
            verify()
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
