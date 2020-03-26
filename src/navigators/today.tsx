import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSafeArea } from 'react-native-safe-area-context'

import { Header } from '../components/common'
import { CheckIns, Feed, Interactions } from '../scenes/today'
import { layout } from '../styles'

export type TodayParamList = {
  CheckIns: {
    date: string
  }
  Feed: {
    date?: string
  }
  Interactions: {
    date: string
  }
}

const { Navigator, Screen } = createStackNavigator<TodayParamList>()

export const TodayNavigator = () => {
  const { top } = useSafeArea()

  return (
    <Navigator>
      <Screen
        component={Feed}
        name="Feed"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Today'
        }}
      />
      <Screen
        component={Interactions}
        name="Interactions"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Have you met anyone today?'
        }}
      />
      <Screen
        component={CheckIns}
        name="CheckIns"
        options={{
          header: (props) => <Header {...props} />,
          headerStyle: {
            height: layout.header + top
          },
          title: 'Have you been anywhere today?'
        }}
      />
    </Navigator>
  )
}
