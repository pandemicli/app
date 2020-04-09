import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import {
  DynamicStyleSheet,
  DynamicValue,
  useDarkMode,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import { Source } from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import {
  img_nav_active_contacts,
  img_nav_active_places,
  img_nav_active_profile,
  img_nav_active_today,
  img_nav_dark_contacts,
  img_nav_dark_places,
  img_nav_dark_profile,
  img_nav_dark_today,
  img_nav_light_contacts,
  img_nav_light_places,
  img_nav_light_profile,
  img_nav_light_today
} from '../../assets'
import { colors, layout } from '../../styles'
import { Image } from './image'
import { Touchable } from './touchable'

const icons: Record<string, DynamicValue<Source>> = {
  Contacts: new DynamicValue(img_nav_dark_contacts, img_nav_light_contacts),
  Places: new DynamicValue(img_nav_dark_places, img_nav_light_places),
  Profile: new DynamicValue(img_nav_dark_profile, img_nav_light_profile),
  Today: new DynamicValue(img_nav_dark_today, img_nav_light_today)
}

const iconsActive: Record<string, Source> = {
  Contacts: img_nav_active_contacts,
  Places: img_nav_active_places,
  Profile: img_nav_active_profile,
  Today: img_nav_active_today
}

export const TabBar: FunctionComponent<BottomTabBarProps> = ({
  navigation: { dispatch, emit },
  state: { index, key, routes }
}) => {
  const isDarkMode = useDarkMode()
  const { bottom } = useSafeArea()

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    Keyboard.addListener('keyboardWillHide', () => setVisible(true))
    Keyboard.addListener('keyboardWillShow', () => setVisible(false))

    return () => {
      Keyboard.removeListener('keyboardWillHide', () => setVisible(true))
      Keyboard.removeListener('keyboardWillShow', () => setVisible(false))
    }
  })

  const styles = useDynamicStyleSheet(stylesheet)
  const background = useDynamicValue('#f6f7f8', '#111')

  if (!visible) {
    return null
  }

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: background
        }
      ]}>
      {routes.map((route, active) => (
        <Touchable
          key={active}
          onPress={() => {
            const event = emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress'
            })

            if (index !== active && !event.defaultPrevented) {
              dispatch({
                ...CommonActions.navigate(route.name),
                target: key
              })
            }
          }}
          style={[
            styles.button,
            {
              paddingBottom: bottom + layout.margin
            }
          ]}>
          <Image
            source={
              index === active
                ? iconsActive[route.name]
                : icons[route.name][isDarkMode ? 'dark' : 'light']
            }
            style={[styles.icon, index === active && styles.active]}
          />
        </Touchable>
      ))}
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  active: {
    opacity: 1
  },
  button: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: layout.margin
  },
  icon: {
    height: layout.icon,
    opacity: 0.25,
    width: layout.icon
  },
  main: {
    borderTopColor: colors.border,
    borderTopWidth: layout.border,
    flexDirection: 'row'
  }
})
