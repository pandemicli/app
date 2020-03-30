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
import { mitter } from './lib'
import { AuthNavigator, MainNavigator } from './navigators'
import { useAuth } from './store'
import { colors } from './styles'

export const Pandemic: FunctionComponent = () => {
  const isDarkMode = useDarkMode()

  const [{ loading, userId }, { init, signOut }] = useAuth()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    mitter.on('logout', () => signOut())

    return () => {
      mitter.off('logout', () => signOut())
    }
  }, [signOut])

  const color_background = useDynamicValue(colors.background)

  if (loading) {
    return <Spinner />
  }

  const theme = isDarkMode
    ? DarkTheme
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: color_background
        }
      }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <KeyboardView>
          <DarkModeProvider>
            <NavigationContainer theme={theme}>
              {userId ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </DarkModeProvider>
        </KeyboardView>
      </SafeAreaProvider>
    </ApolloProvider>
  )
}
