import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TextInput } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import {} from 'react-native-gesture-handler'

import { img_dark_save, img_light_save } from '../../assets'
import {
  Header,
  HeaderButton,
  PhoneNumber,
  TextBox
} from '../../components/common'
import { useContacts } from '../../hooks'
import { ContactsParamList } from '../../navigators'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ContactsParamList, 'EditContact'>
  route: RouteProp<ContactsParamList, 'EditContact'>
}

export const EditContact: FunctionComponent<Props> = ({
  navigation: { replace, setOptions },
  route: {
    params: { contact }
  }
}) => {
  const { update, updating } = useContacts()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const phoneRef = createRef<TextInput>()

  const styles = useDynamicStyleSheet(stylesheet)
  const save = useDynamicValue(img_dark_save, img_light_save)

  useEffect(() => {
    const { name, phone } = contact

    setName(name)

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
            updating ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.spinner}
              />
            ) : (
              <HeaderButton
                icon={save}
                onPress={() => {
                  if (name) {
                    update(contact.id, {
                      name,
                      phone: phone || null
                    })
                  }
                }}
              />
            )
          }
        />
      )
    })
  }, [
    update,
    updating,
    name,
    phone,
    replace,
    save,
    setOptions,
    styles.spinner,
    contact.id
  ])

  return (
    <ScrollView
      contentContainerStyle={styles.main}
      keyboardShouldPersistTaps="always">
      <TextBox
        autoCorrect={false}
        onChangeText={(name) => setName(name)}
        onSubmitEditing={() => phoneRef.current?.focus()}
        placeholder="Name"
        returnKeyType="next"
        style={styles.item}
        value={name}
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
