import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSafeArea } from 'react-native-safe-area-context'

import { Header } from '../components/common'
import { Landing, SignIn, SignUp, Verify } from '../scenes/auth'
import { layout } from '../styles'

export type AuthParamList = {
  Landing: undefined
  SignIn: undefined
  SignUp: undefined
  Verify: undefined
}

const { Navigator, Screen } = createStackNavigator<AuthParamList>()

export const AuthNavigator = () => {
  const { top } = useSafeArea()

  return (
    <Navigator>
      <Screen
        component={Landing}
        name="Landing"
        options={{
          headerShown: false
        }}
      />
      <Screen
        component={SignUp}
        name="SignUp"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Sign up'
        }}
      />
      <Screen
        component={SignIn}
        name="SignIn"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Sign in'
        }}
      />
      <Screen
        component={Verify}
        name="Verify"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Verify'
        }}
      />
    </Navigator>
  )
}
