import { NavigationProp } from '@react-navigation/native'
import React, { createRef, FunctionComponent, useState } from 'react'
import { TextInput, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, Message, PhoneNumber, TextBox } from '../../components/common'
import { useOnboarding } from '../../hooks'
import { i18n } from '../../i18n'
import { AuthParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'SignUp'>
}

export const SignUp: FunctionComponent<Props> = () => {
  const { bottom } = useSafeArea()

  const { errors, signUp, signingUp } = useOnboarding()

  const emailRef = createRef<TextInput>()
  const phoneRef = createRef<TextInput>()
  const passwordRef = createRef<TextInput>()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        {
          paddingBottom: bottom + layout.margin
        }
      ]}>
      {errors.signUp && (
        <Message message={errors.signUp} style={styles.item} type="error" />
      )}
      <TextBox
        autoCapitalize="words"
        autoCorrect={false}
        onChangeText={(name) => setName(name)}
        onSubmitEditing={() => emailRef.current?.focus()}
        placeholder={i18n.t('label__name')}
        returnKeyType="next"
        style={styles.item}
        value={name}
      />
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={(email) => setEmail(email)}
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder={i18n.t('label__email')}
        ref={emailRef}
        returnKeyType="next"
        style={styles.item}
        value={email}
      />
      <TextBox
        onChangeText={(password) => setPassword(password)}
        onSubmitEditing={() => phoneRef.current?.focus()}
        placeholder={i18n.t('label__password')}
        ref={passwordRef}
        returnKeyType="next"
        secureTextEntry
        style={styles.item}
        value={password}
      />
      <PhoneNumber
        onChange={(phone) => setPhone(phone)}
        ref={phoneRef}
        style={styles.item}
      />
      <Button
        label={i18n.t('label__sign_up')}
        loading={signingUp}
        onPress={() => {
          if (name && email && password && phone) {
            signUp(name, email, password, phone)
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
