import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'
import { ActivityIndicator, ScrollView, Switch, Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { i18n } from '../../i18n'
import { analytics } from '../../lib'
import { ProfileParamList } from '../../navigators'
import { useNotifications } from '../../store'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Notifications'>
  route: RouteProp<ProfileParamList, 'Notifications'>
}

export const Notifications: FunctionComponent<Props> = () => {
  const [{ enabled, loading }, { disable, enable, init }] = useNotifications()

  useEffect(() => {
    init()
  }, [init])

  const styles = useDynamicStyleSheet(stylesheet)
  const color_background = useDynamicValue(colors.background)

  return (
    <ScrollView style={styles.main}>
      <View style={styles.switch}>
        <Text style={styles.label}>
          {i18n.t('profile__notifications__daily_reminder__label')}
        </Text>
        {loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Switch
            onValueChange={(value) => {
              if (value) {
                enable()

                analytics.track('Daily Reminder Enabled')
              } else {
                disable()

                analytics.track('Daily Reminder Disabled')
              }
            }}
            trackColor={{
              false: color_background,
              true: colors.primary
            }}
            value={enabled}
          />
        )}
      </View>
    </ScrollView>
  )
}

const stylesheet = new DynamicStyleSheet({
  label: {
    ...typography.paragraph,
    color: colors.foreground,
    flex: 1,
    marginEnd: layout.margin
  },
  main: {
    padding: layout.margin
  },
  switch: {
    alignItems: 'center',
    flexDirection: 'row'
  }
})
