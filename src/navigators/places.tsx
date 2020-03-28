import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useDynamicValue } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_dark_add, img_light_add } from '../assets'
import { Header, HeaderButton } from '../components/common'
import { Place } from '../graphql/types'
import { i18n } from '../i18n'
import { AddPlace, EditPlace, Places } from '../scenes/places'
import { layout } from '../styles'

export type PlacesParamList = {
  Places: undefined
  AddPlace: undefined
  EditPlace: {
    place: Place
  }
}

const { Navigator, Screen } = createStackNavigator<PlacesParamList>()

export const PlacesNavigator = () => {
  const { top } = useSafeArea()

  const img_add = useDynamicValue(img_dark_add, img_light_add)

  return (
    <Navigator>
      <Screen
        component={Places}
        name="Places"
        options={({ navigation: { navigate } }) => ({
          header: (props) => (
            <Header
              {...props}
              right={
                <HeaderButton
                  icon={img_add}
                  onPress={() => navigate('AddPlace')}
                />
              }
            />
          ),
          headerStyle: {
            height: layout.header + top
          },
          title: i18n.t('places__title__places')
        })}
      />
      <Screen
        component={AddPlace}
        name="AddPlace"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: i18n.t('places__title__add_place')
        }}
      />
      <Screen
        component={EditPlace}
        name="EditPlace"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: i18n.t('places__title__edit_place')
        }}
      />
    </Navigator>
  )
}
