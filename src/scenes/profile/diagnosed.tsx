import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, Text } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Button } from '../../components/common'
import { useToggleStatus } from '../../hooks'
import { i18n } from '../../i18n'
import { dialog } from '../../lib'
import { ProfileParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Diagnosed'>
  route: RouteProp<ProfileParamList, 'Diagnosed'>
}

export const Diagnosed: FunctionComponent<Props> = ({
  navigation: { setParams },
  route: {
    key,
    params: { user }
  }
}) => {
  console.log('positive', user.covid19Positive)

  const { loading, toggle } = useToggleStatus()

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <ScrollView style={styles.main}>
      <Text style={styles.message}>
        {i18n.t(
          user.covid19Positive
            ? 'profile__diagnosed__message__no'
            : 'profile__diagnosed__message__yes'
        )}
      </Text>
      <Button
        label={i18n.t(
          user.covid19Positive ? 'label__im_negative' : 'label__im_positive'
        )}
        loading={loading}
        onPress={async () => {
          const yes = await dialog.confirm(
            i18n.t(
              user.covid19Positive
                ? 'lib__dialog__confirm__im_negative'
                : 'lib__dialog__confirm__im_positive'
            )
          )

          if (yes) {
            toggle(key, (user) =>
              setParams({
                user
              })
            )
          }
        }}
        style={styles.button}
      />
    </ScrollView>
  )
}

const stylesheet = new DynamicStyleSheet({
  button: {
    marginTop: layout.margin * 2
  },
  main: {
    padding: layout.margin
  },
  message: {
    ...typography.footnote,
    color: colors.foreground
  }
})
