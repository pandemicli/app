import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TextInput } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { img_dark_save, img_light_save } from '../../assets'
import {
  Header,
  HeaderButton,
  Message,
  PhoneNumber,
  TextBox
} from '../../components/common'
import { useContactActions } from '../../hooks'
import { i18n } from '../../i18n'
import { analytics } from '../../lib'
import { ContactsParamList } from '../../navigators'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ContactsParamList, 'AddContact'>
  route: RouteProp<ContactsParamList, 'AddContact'>
}

export const AddContact: FunctionComponent<Props> = ({
  navigation: { replace, setOptions }
}) => {
  const { create, creating, errors } = useContactActions()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const emailRef = createRef<TextInput>()
  const phoneRef = createRef<TextInput>()

  const styles = useDynamicStyleSheet(stylesheet)
  const img_save = useDynamicValue(img_dark_save, img_light_save)

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            creating ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.spinner}
              />
            ) : (
              <HeaderButton
                icon={img_save}
                onPress={() => {
                  if (name) {
                    create(
                      {
                        email: email || null,
                        name,
                        phone: phone || null
                      },
                      (contact) =>
                        replace('EditContact', {
                          contact
                        })
                    )

                    analytics.track('Contact Added')
                  }
                }}
              />
            )
          }
        />
      )
    })
  }, [
    create,
    creating,
    email,
    img_save,
    name,
    phone,
    replace,
    setOptions,
    styles.spinner
  ])

  return (
    <ScrollView
      contentContainerStyle={styles.main}
      keyboardShouldPersistTaps="always">
      {errors.creating && (
        <Message
          message={errors.creating.message}
          style={styles.item}
          type="error"
        />
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
        onChangeText={(email) => setEmail(email)}
        onSubmitEditing={() => phoneRef.current?.focus()}
        placeholder={i18n.t('label__email')}
        returnKeyType="next"
        style={styles.item}
        value={email}
      />
      <PhoneNumber onChange={(phone) => setPhone(phone)} ref={phoneRef} />
    </ScrollView>
  )
}

const stylesheet = new DynamicStyleSheet({
  item: {
    marginBottom: layout.margin
  },
  main: {
    padding: layout.margin
  },
  spinner: {
    margin: layout.margin
  }
})
