import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TextInput } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import {
  img_dark_remove,
  img_dark_save,
  img_light_remove,
  img_light_save
} from '../../assets'
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
  navigation: StackNavigationProp<ContactsParamList, 'EditContact'>
  route: RouteProp<ContactsParamList, 'EditContact'>
}

export const EditContact: FunctionComponent<Props> = ({
  navigation: { pop, setOptions },
  route: {
    params: { contact }
  }
}) => {
  const { errors, remove, removing, update, updating } = useContactActions()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const emailRef = createRef<TextInput>()
  const phoneRef = createRef<TextInput>()

  const styles = useDynamicStyleSheet(stylesheet)
  const img_remove = useDynamicValue(img_dark_remove, img_light_remove)
  const img_save = useDynamicValue(img_dark_save, img_light_save)

  useEffect(() => {
    const { email, name, phone } = contact

    setName(name)

    if (email) {
      setEmail(email)
    }

    if (phone) {
      setPhone(phone)
    }
  }, [contact])

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            <>
              {removing ? (
                <ActivityIndicator
                  color={colors.primary}
                  style={styles.spinner}
                />
              ) : (
                <HeaderButton
                  icon={img_remove}
                  onPress={() =>
                    remove(contact.id, () => {
                      pop()

                      analytics.track('Contact Deleted')
                    })
                  }
                />
              )}
              {updating ? (
                <ActivityIndicator
                  color={colors.primary}
                  style={styles.spinner}
                />
              ) : (
                <HeaderButton
                  icon={img_save}
                  onPress={() => {
                    if (name) {
                      update(contact.id, {
                        email: email || null,
                        name,
                        phone: phone || null
                      })

                      analytics.track('Contact Updated')
                    }
                  }}
                />
              )}
            </>
          }
        />
      )
    })
  }, [
    contact.id,
    email,
    img_remove,
    img_save,
    name,
    phone,
    pop,
    remove,
    removing,
    setOptions,
    styles.spinner,
    update,
    updating
  ])

  return (
    <ScrollView
      contentContainerStyle={styles.main}
      keyboardShouldPersistTaps="always">
      {errors.updating && (
        <Message message={errors.updating} style={styles.item} type="error" />
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
      <PhoneNumber
        onChange={(phone) => setPhone(phone)}
        ref={phoneRef}
        value={phone}
      />
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
