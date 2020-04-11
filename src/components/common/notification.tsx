import messaging from '@react-native-firebase/messaging'
import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  Image,
  LayoutAnimation,
  Platform,
  Text,
  UIManager,
  View
} from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import { useSafeArea } from 'react-native-safe-area-context'

import {
  img_light_close,
  img_light_error,
  img_light_notifications
} from '../../assets'
import { mitter } from '../../lib'
import { colors, layout, typography } from '../../styles'
import { NotificationPayload } from '../../types'
import { Touchable } from './touchable'

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

export const Notification: FunctionComponent = () => {
  const { top } = useSafeArea()

  const [notification, setNotification] = useState<NotificationPayload | null>(
    null
  )

  useEffect(() => {
    mitter.onError((notification) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      setNotification(notification)

      setTimeout(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

        setNotification(null)
      }, 5000)
    })

    const unsubscribe = messaging().onMessage((message) => {
      if (message.notification) {
        const { body, title } = message.notification

        if (body && title) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

          setNotification({
            body,
            title,
            type: 'push'
          })
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View
      style={[
        styles.main,
        {
          paddingTop: top + layout.margin
        },
        notification ? styles.visible : styles.hidden,
        notification?.type === 'error' && styles.error
      ]}>
      <Image
        source={
          notification?.type === 'error'
            ? img_light_error
            : img_light_notifications
        }
        style={styles.icon}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{notification?.title}</Text>
        <Text style={styles.body}>{notification?.body}</Text>
      </View>
      {notification?.type === 'push' && (
        <Touchable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

            setNotification(null)
          }}>
          <Image source={img_light_close} style={styles.icon} />
        </Touchable>
      )}
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  body: {
    ...typography.paragraph,
    color: colors.white,
    marginTop: layout.padding / 2
  },
  details: {
    flex: 1
  },
  error: {
    backgroundColor: colors.state.warning,
    borderBottomColor: colors.state.error
  },
  hidden: {
    bottom: '100%'
  },
  icon: {
    height: layout.icon,
    margin: layout.margin,
    width: layout.icon
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    borderBottomWidth: layout.border * 2,
    flexDirection: 'row',
    paddingVertical: layout.margin,
    position: 'absolute',
    width: '100%'
  },
  title: {
    ...typography.subtitle,
    color: colors.white
  },
  visible: {
    top: 0
  }
})
