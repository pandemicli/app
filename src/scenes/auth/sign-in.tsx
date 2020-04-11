import { NavigationProp } from '@react-navigation/native'
import React, { createRef, FunctionComponent, useState } from 'react'
import { TextInput, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, Message, TextBox } from '../../components/common'
import { useUser } from '../../hooks'
import { i18n } from '../../i18n'
import { AuthParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'SignIn'>
}

export const SignIn: FunctionComponent<Props> = () => {
  const { bottom } = useSafeArea()

  const { errors, signIn, signingIn } = useUser()

  const passwordRef = createRef<TextInput>()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        {
          paddingBottom: bottom + layout.margin
        }
      ]}>
      {errors.signIn && (
        <Message message={errors.signIn} style={styles.item} type="error" />
      )}
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={(email) => setEmail(email)}
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder={i18n.t('label__email')}
        returnKeyType="next"
        style={styles.item}
        value={email}
      />
      <TextBox
        onChangeText={(password) => setPassword(password)}
        placeholder={i18n.t('label__password')}
        ref={passwordRef}
        returnKeyType="done"
        secureTextEntry
        style={styles.item}
        value={password}
      />
      <Button
        label={i18n.t('label__sign_in')}
        loading={signingIn}
        onPress={() => {
          if (email && password) {
            signIn(email, password)
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
