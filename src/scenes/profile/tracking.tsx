import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ActivityIndicator, ScrollView, Switch, Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { useTracking } from '../../hooks'
import { i18n } from '../../i18n'
import { analytics, browser } from '../../lib'
import { ProfileParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Tracking'>
  route: RouteProp<ProfileParamList, 'Tracking'>
}

export const Tracking: FunctionComponent<Props> = () => {
  const { enabled, loading, start, stop } = useTracking()

  const styles = useDynamicStyleSheet(stylesheet)
  const color_background = useDynamicValue(colors.background)

  return (
    <ScrollView style={styles.main}>
      <Text style={styles.message}>{i18n.t('profile__tracking__message')}</Text>
      <Text
        onPress={() => browser.open('https://pandemic.li/privacy')}
        style={[styles.message, styles.privacy]}>
        {i18n.t('label__learn_more_privacy_policy')}
      </Text>
      <View style={styles.switch}>
        <Text style={styles.label}>{i18n.t('profile__tracking__label')}</Text>
        {loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Switch
            onValueChange={(value) => {
              if (value) {
                start()

                analytics.track('Tracking Enabled')
              } else {
                stop()

                analytics.track('Tracking Disabled')
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
      <Text style={styles.message}>
        {i18n.t('label__battery_performance_warning')}
      </Text>
    </ScrollView>
  )
}

const stylesheet = new DynamicStyleSheet({
  label: {
    ...typography.regular,
    color: colors.foreground,
    flex: 1,
    marginEnd: layout.margin
  },
  main: {
    padding: layout.margin
  },
  message: {
    ...typography.footnote,
    color: colors.foreground
  },
  privacy: {
    color: colors.primary,
    marginTop: layout.margin
  },
  switch: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: layout.margin
  }
})
