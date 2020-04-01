import { ApolloProvider } from '@apollo/react-hooks'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer
} from '@react-navigation/native'
import update from 'immutability-helper'
import React, { FunctionComponent, useEffect } from 'react'
import {
  DarkModeProvider,
  useDarkMode,
  useDynamicValue
} from 'react-native-dark-mode'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { KeyboardView, Spinner } from './components/common'
import { client } from './graphql'
import { analytics, mitter, nav } from './lib'
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
    if (!loading) {
      analytics.screen(userId ? 'Feed' : 'Landing')
    }
  }, [loading, userId])

  useEffect(() => {
    mitter.on('logout', () => signOut())

    return () => {
      mitter.off('logout', () => signOut())
    }
  }, [signOut])

  const color_background = useDynamicValue(colors.background)

  const LightTheme = update(DefaultTheme, {
    colors: {
      background: {
        $set: color_background
      }
    }
  })

  const theme = isDarkMode ? DarkTheme : LightTheme

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <KeyboardView>
          <DarkModeProvider>
            <NavigationContainer
              onStateChange={(state) => nav.onStateChange(state)}
              ref={nav.ref}
              theme={theme}>
              {loading && <Spinner />}
              {userId ? <MainNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </DarkModeProvider>
        </KeyboardView>
      </SafeAreaProvider>
    </ApolloProvider>
  )
}
