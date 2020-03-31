import { NavigationProp } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { img_pandemicli } from '../../assets'
import { Button, Carousel, Image } from '../../components/common'
import { i18n } from '../../i18n'
import { AuthParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: NavigationProp<AuthParamList, 'Landing'>
}

export const Landing: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.main}>
      <Image source={img_pandemicli} style={styles.logo} />
      <Text style={styles.title}>{i18n.t('pandemicli')}</Text>
      <Text style={styles.description}>{i18n.t('landing__message')}</Text>
      <Carousel style={styles.carousel}>
        <View style={styles.card}>
          <Text style={styles.subtitle}>
            {i18n.t('auth__landing__track_contacts__title')}
          </Text>
          <Text style={styles.message}>
            {i18n.t('auth__landing__track_contacts__message')}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>
            {i18n.t('auth__landing__track_places__title')}
          </Text>
          <Text style={styles.message}>
            {i18n.t('auth__landing__track_places__message')}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>
            {i18n.t('auth__landing__track_symptoms__title')}
          </Text>
          <Text style={styles.message}>
            {i18n.t('auth__landing__track_symptoms__message')}
          </Text>
        </View>
      </Carousel>
      <View style={styles.footer}>
        <Button
          label={i18n.t('label__sign_in')}
          onPress={() => navigate('SignIn')}
        />
        <Button
          label={i18n.t('label__sign_up')}
          onPress={() => navigate('SignUp')}
          style={styles.signUp}
        />
      </View>
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  card: {
    alignItems: 'center'
  },
  carousel: {
    marginVertical: layout.margin * 4
  },
  description: {
    ...typography.footnote,
    color: colors.foreground,
    marginHorizontal: layout.margin * 2,
    marginVertical: layout.padding,
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row'
  },
  logo: {
    height: layout.logo,
    width: layout.logo
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center'
  },
  message: {
    ...typography.paragraph,
    color: colors.foreground,
    marginHorizontal: layout.margin,
    marginTop: layout.padding,
    textAlign: 'center'
  },
  signUp: {
    backgroundColor: colors.accent,
    marginStart: layout.margin
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
    marginHorizontal: layout.margin
  },
  title: {
    ...typography.title,
    color: colors.primary,
    marginTop: layout.margin
  }
})
