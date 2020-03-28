import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useDynamicValue } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_dark_camera, img_light_camera } from '../assets'
import { Header, HeaderButton } from '../components/common'
import { Profile, Scan } from '../scenes/profile'
import { layout } from '../styles'

export type ProfileParamList = {
  Profile: undefined
  Scan: undefined
}

const { Navigator, Screen } = createStackNavigator<ProfileParamList>()

export const ProfileNavigator = () => {
  const { top } = useSafeArea()

  const img_camera = useDynamicValue(img_dark_camera, img_light_camera)

  return (
    <Navigator>
      <Screen
        component={Profile}
        name="Profile"
        options={({ navigation: { navigate } }) => ({
          header: (props) => (
            <Header
              {...props}
              left={
                <HeaderButton
                  icon={img_camera}
                  onPress={() => navigate('Scan')}
                />
              }
            />
          ),
          headerStyle: {
            height: layout.header + top
          },
          title: 'Profile'
        })}
      />
      <Screen
        component={Scan}
        name="Scan"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Scan'
        }}
      />
    </Navigator>
  )
}
