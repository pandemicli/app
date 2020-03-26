import { createStackNavigator } from '@react-navigation/stack'
import moment from 'moment'
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
    date: string
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
        initialParams={{
          date: moment().startOf('day').toISOString()
        }}
        name="Feed"
        options={({
          navigation: { setParams },
          route: {
            params: { date }
          }
        }) => ({
          header: (props) => (
            <Header
              {...props}
              onNext={() =>
                setParams({
                  date: moment(date).add(1, 'day').toISOString()
                })
              }
              onPrevious={() =>
                setParams({
                  date: moment(date).subtract(1, 'day').toISOString()
                })
              }
            />
          ),
          headerStyle: {
            height: layout.header + top
          },
          title: moment().isSame(date, 'day')
            ? 'Today'
            : moment(date).format('MMM D')
        })}
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
