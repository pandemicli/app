import { useMutation } from '@apollo/react-hooks'
import { NavigationProp } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import { View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, Message, PhoneNumber } from '../../components/common'
import { SIGN_IN } from '../../graphql/documents'
import { MutationSignInPayload } from '../../graphql/payload'
import { MutationSignInArgs } from '../../graphql/types'
import { AuthParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'SignIn'>
}

export const SignIn: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const { bottom } = useSafeArea()

  const [phone, setPhone] = useState('')

  const [signIn, { error, loading }] = useMutation<
    MutationSignInPayload,
    MutationSignInArgs
  >(SIGN_IN, {
    onCompleted() {
      navigate('Verify')
    },
    variables: {
      phone
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
      <PhoneNumber onChange={(phone) => setPhone(phone)} style={styles.item} />
      <Button
        label="Sign in"
        loading={loading}
        onPress={() => {
          if (phone) {
            signIn()
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
