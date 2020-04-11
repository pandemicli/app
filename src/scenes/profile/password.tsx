import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TextInput } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { img_dark_save, img_light_save } from '../../assets'
import { Header, HeaderButton, Message, TextBox } from '../../components/common'
import { useUser } from '../../hooks'
import { i18n } from '../../i18n'
import { analytics } from '../../lib'
import { ProfileParamList } from '../../navigators'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Notifications'>
  route: RouteProp<ProfileParamList, 'Notifications'>
}

export const Password: FunctionComponent<Props> = ({
  navigation: { setOptions }
}) => {
  const { changePassword, changingPassword, errors } = useUser()

  const newPasswordRef = createRef<TextInput>()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [updated, setUpdated] = useState(false)

  const styles = useDynamicStyleSheet(stylesheet)
  const img_save = useDynamicValue(img_dark_save, img_light_save)

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            changingPassword ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.spinner}
              />
            ) : (
              <HeaderButton
                icon={img_save}
                onPress={() => {
                  if (currentPassword && newPassword) {
                    changePassword(currentPassword, newPassword, () =>
                      setUpdated(true)
                    )

                    analytics.track('Password Changed')
                  }
                }}
              />
            )
          }
        />
      )
    })
  }, [
    changePassword,
    changingPassword,
    currentPassword,
    img_save,
    newPassword,
    setOptions,
    styles.spinner
  ])

  return (
    <ScrollView style={styles.main}>
      {errors.changePassword && (
        <Message
          message={errors.changePassword}
          style={styles.item}
          type="error"
        />
      )}
      {updated && (
        <Message
          message={i18n.t('profile__change_password__message__updated')}
          style={styles.item}
          type="success"
        />
      )}
      <TextBox
        onChangeText={(password) => setCurrentPassword(password)}
        onSubmitEditing={() => newPasswordRef.current?.focus()}
        placeholder={i18n.t('label__current_password')}
        returnKeyType="next"
        secureTextEntry
        style={styles.item}
        value={currentPassword}
      />
      <TextBox
        onChangeText={(password) => setNewPassword(password)}
        placeholder={i18n.t('label__new_password')}
        ref={newPasswordRef}
        returnKeyType="done"
        secureTextEntry
        value={newPassword}
      />
    </ScrollView>
  )
}

const stylesheet = new DynamicStyleSheet({
  item: {
    marginBottom: layout.margin
  },
  main: {
    padding: layout.margin
  },
  spinner: {
    margin: layout.margin
  }
})
