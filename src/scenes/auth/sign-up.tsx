import { useMutation } from '@apollo/react-hooks'
import { NavigationProp } from '@react-navigation/native'
import React, { createRef, FunctionComponent, useState } from 'react'
import { TextInput, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, Message, PhoneNumber, TextBox } from '../../components/common'
import { SIGN_UP } from '../../graphql/documents'
import { MutationSignUpPayload } from '../../graphql/payload'
import { MutationSignUpArgs } from '../../graphql/types'
import { i18n } from '../../i18n'
import { analytics } from '../../lib'
import { AuthParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'SignUp'>
}

export const SignUp: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const { bottom } = useSafeArea()

  const phoneRef = createRef<TextInput>()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const [signUp, { error, loading }] = useMutation<
    MutationSignUpPayload,
    MutationSignUpArgs
  >(SIGN_UP, {
    onCompleted() {
      navigate('Verify')

      analytics.track('User Signed Up')
    },
    variables: {
      name,
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
      <TextBox
        onChangeText={(name) => setName(name)}
        onSubmitEditing={() => phoneRef.current?.focus()}
        placeholder={i18n.t('label__name')}
        returnKeyType="next"
        style={styles.item}
        value={name}
      />

      <PhoneNumber
        onChange={(phone) => setPhone(phone)}
        ref={phoneRef}
        style={styles.item}
      />
      <Button
        label={i18n.t('label__sign_up')}
        loading={loading}
        onPress={() => {
          if (name && phone) {
            signUp()
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
