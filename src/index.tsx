import { ApolloProvider } from '@apollo/react-hooks'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer
} from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import {
  DarkModeProvider,
  useDarkMode,
  useDynamicValue
} from 'react-native-dark-mode'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { KeyboardView, Spinner } from './components/common'
import { client } from './graphql'
import { AuthNavigator, MainNavigator } from './navigators'
import { useAuth } from './store'
import { colors } from './styles'

export const Pandemic: FunctionComponent = () => {
  const isDarkMode = useDarkMode()

  const [{ loading, token }, { init }] = useAuth()

  useEffect(() => {
    init()
  }, [init])

  const background = useDynamicValue(colors.background)

  if (loading) {
    return <Spinner />
  }

  const theme = isDarkMode
    ? DarkTheme
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background
        }
      }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <KeyboardView>
          <DarkModeProvider>
            <NavigationContainer theme={theme}>
              {token ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </DarkModeProvider>
        </KeyboardView>
      </SafeAreaProvider>
    </ApolloProvider>
  )
}
