import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Dimensions, FlatList, Image, Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import QRCode from 'react-native-qrcode-svg'

import {
  img_dark_about,
  img_dark_help,
  img_dark_link,
  img_dark_sign_out,
  img_light_about,
  img_light_help,
  img_light_link,
  img_light_sign_out
} from '../../assets'
import { Refresher, Separator, Touchable } from '../../components/common'
import { PROFILE } from '../../graphql/documents'
import { QueryProfilePayload } from '../../graphql/payload'
import { browser } from '../../lib'
import { ProfileParamList } from '../../navigators'
import { useAuth } from '../../store'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Profile'>
  route: RouteProp<ProfileParamList, 'Profile'>
}

export const Profile: FunctionComponent<Props> = () => {
  const [, { signOut }] = useAuth()

  const { data, loading, refetch } = useQuery<QueryProfilePayload>(PROFILE)

  const { width } = Dimensions.get('window')

  const styles = useDynamicStyleSheet(stylesheet)
  const img_about = useDynamicValue(img_dark_about, img_light_about)
  const img_help = useDynamicValue(img_dark_help, img_light_help)
  const img_link = useDynamicValue(img_dark_link, img_light_link)
  const img_sign_out = useDynamicValue(img_dark_sign_out, img_light_sign_out)

  return (
    <FlatList
      data={[
        {
          icon: img_about,
          label: 'About',
          link: true,
          onPress: () => browser.open('https://pandemic.li')
        },
        {
          icon: img_help,
          label: 'Help',
          link: true,
          onPress: () => browser.open('https://pandemic.li/help')
        },
        {
          icon: img_sign_out,
          label: 'Sign out',
          onPress: () => signOut()
        }
      ]}
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.label}
      ListHeaderComponent={
        data?.profile ? (
          <View style={styles.main}>
            <View style={styles.qr}>
              <QRCode
                backgroundColor="#fff"
                size={width / 3}
                value={data.profile.code}
              />
            </View>
            <Text style={styles.greeting}>
              Hello, {data.profile.name.split(' ').shift()}
            </Text>
            <Text style={styles.message}>
              This is your Pandemic.li QR code.
            </Text>
            <Text style={styles.message}>
              Other people can scan this code to add you as a contact on the
              app.
            </Text>
            <Text style={styles.message}>
              You can scan other codes from the top left button to add them as a
              contact.
            </Text>
          </View>
        ) : null
      }
      refreshControl={
        <Refresher onRefresh={() => refetch()} refreshing={loading} />
      }
      renderItem={({ item }) => (
        <Touchable onPress={item.onPress} style={styles.item}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
          {item.link && (
            <Image source={img_link} style={[styles.icon, styles.iconSmall]} />
          )}
        </Touchable>
      )}
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  greeting: {
    ...typography.title,
    color: colors.primary,
    marginTop: layout.margin * 2,
    textAlign: 'center'
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  iconSmall: {
    height: layout.icon * 0.75,
    opacity: 0.5,
    width: layout.icon * 0.75
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: layout.margin
  },
  label: {
    ...typography.small,
    color: colors.foreground,
    flex: 1,
    marginHorizontal: layout.margin
  },
  main: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    justifyContent: 'center',
    padding: layout.margin * 2
  },
  message: {
    ...typography.footnote,
    color: colors.foreground,
    marginTop: layout.padding,
    textAlign: 'center'
  },
  qr: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: layout.radius * 4,
    padding: layout.margin
  }
})
