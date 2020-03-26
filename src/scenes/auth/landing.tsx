import { NavigationProp } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { Image, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { img_pandemicli } from '../../assets'
import { Button, Carousel } from '../../components/common'
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
      <Carousel style={styles.carousel}>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Track contacts</Text>
          <Text style={styles.copy}>
            Keep a track of people you see regularly. Log whenever you meet
            them.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Track places</Text>
          <Text style={styles.copy}>
            Keep a track of places you visit regularly. Log whenever you visit
            them.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Track symptoms</Text>
          <Text style={styles.copy}>
            Keep track of your symptoms and log if you have been diagnosed with
            Corona. The app will notify all people you have met recently to get
            tested.
          </Text>
        </View>
      </Carousel>
      <View style={styles.footer}>
        <Button label="Sign in" onPress={() => navigate('SignIn')} />
        <Button
          label="Sign up"
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
    marginVertical: layout.margin * 2
  },
  copy: {
    ...typography.paragraph,
    color: colors.foreground,
    marginTop: layout.padding,
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
  signUp: {
    backgroundColor: colors.accent,
    marginLeft: layout.margin
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
    textAlign: 'center'
  }
})
