import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import { TabBar } from '../components/common'
import { ContactsNavigator } from './contacts'
import { PlacesNavigator } from './places'
import { ProfileNavigator } from './profile'
import { TodayNavigator } from './today'

export type MainParamList = {
  Contacts: undefined
  Places: undefined
  Profile: undefined
  Today: undefined
}

const { Navigator, Screen } = createBottomTabNavigator<MainParamList>()

export const MainNavigator = () => (
  <Navigator tabBar={(props) => <TabBar {...props} />}>
    <Screen component={TodayNavigator} name="Today" />
    <Screen component={ContactsNavigator} name="Contacts" />
    <Screen component={PlacesNavigator} name="Places" />
    <Screen component={ProfileNavigator} name="Profile" />
  </Navigator>
)
