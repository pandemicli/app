import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSafeArea } from 'react-native-safe-area-context'

import { Header } from '../components/common'
import { Contact } from '../graphql/types'
import { AddContact, Contacts, EditContact } from '../scenes/contacts'
import { layout } from '../styles'

export type ContactsParamList = {
  Contacts: undefined
  AddContact: undefined
  EditContact: {
    contact: Contact
  }
}

const { Navigator, Screen } = createStackNavigator<ContactsParamList>()

export const ContactsNavigator = () => {
  const { top } = useSafeArea()

  return (
    <Navigator>
      <Screen
        component={Contacts}
        name="Contacts"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Contacts'
        }}
      />
      <Screen
        component={AddContact}
        name="AddContact"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Add contact'
        }}
      />
      <Screen
        component={EditContact}
        name="EditContact"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Edit contact'
        }}
      />
    </Navigator>
  )
}
