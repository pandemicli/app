import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  View
} from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import QRCode from 'react-native-qrcode-svg'

import {
  img_dark_about,
  img_dark_diagnosed,
  img_dark_help,
  img_dark_link,
  img_dark_notifications,
  img_dark_privacy,
  img_dark_remove_data,
  img_dark_sign_out,
  img_dark_tracking,
  img_light_about,
  img_light_diagnosed,
  img_light_help,
  img_light_link,
  img_light_notifications,
  img_light_privacy,
  img_light_remove_data,
  img_light_sign_out,
  img_light_tracking
} from '../../assets'
import { Image, Refresher, Separator, Touchable } from '../../components/common'
import { PROFILE } from '../../graphql/documents'
import { QueryProfilePayload } from '../../graphql/payload'
import { i18n } from '../../i18n'
import { analytics, browser } from '../../lib'
import { ProfileParamList } from '../../navigators'
import { useAuth } from '../../store'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Profile'>
  route: RouteProp<ProfileParamList, 'Profile'>
}

export const Profile: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const [{ unloading }, { signOut }] = useAuth()

  const { data, loading, refetch } = useQuery<QueryProfilePayload>(PROFILE)

  const { width } = Dimensions.get('window')

  const styles = useDynamicStyleSheet(stylesheet)
  const img_about = useDynamicValue(img_dark_about, img_light_about)
  const img_help = useDynamicValue(img_dark_help, img_light_help)
  const img_link = useDynamicValue(img_dark_link, img_light_link)
  const img_privacy = useDynamicValue(img_dark_privacy, img_light_privacy)
  const img_diagnosed = useDynamicValue(img_dark_diagnosed, img_light_diagnosed)
  const img_sign_out = useDynamicValue(img_dark_sign_out, img_light_sign_out)
  const img_tracking = useDynamicValue(img_dark_tracking, img_light_tracking)
  const img_notifications = useDynamicValue(
    img_dark_notifications,
    img_light_notifications
  )
  const img_remove_data = useDynamicValue(
    img_dark_remove_data,
    img_light_remove_data
  )

  return (
    <FlatList
      data={[
        {
          icon: img_diagnosed,
          label: i18n.t('profile__menu__diagnosed'),
          onPress: () => {
            if (data?.profile) {
              navigate('Diagnosed', {
                user: data.profile
              })
            }
          }
        },
        {
          icon: img_tracking,
          label: i18n.t('profile__menu__tracking'),
          onPress: () => navigate('Tracking')
        },
        {
          icon: img_notifications,
          label: i18n.t('profile__menu__notifications'),
          onPress: () => navigate('Notifications')
        },
        {
          icon: img_about,
          label: i18n.t('profile__menu__about'),
          link: true,
          onPress: () => browser.open('https://pandemic.li')
        },
        {
          icon: img_help,
          label: i18n.t('profile__menu__help'),
          link: true,
          onPress: () => browser.open('https://pandemic.li/help')
        },
        {
          icon: img_privacy,
          label: i18n.t('profile__menu__privacy'),
          link: true,
          onPress: () => browser.open('https://pandemic.li/privacy')
        },
        {
          icon: img_remove_data,
          label: i18n.t('profile__menu__delete_account'),
          warning: true
        },
        {
          icon: img_sign_out,
          label: i18n.t('profile__menu__sign_out'),
          loading: unloading,
          onPress: () => {
            signOut()

            analytics.track('User Signed Out')
          },
          warning: true
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
              {i18n.t('profile__message__1', {
                name: data.profile.name.split(' ')[0]
              })}
            </Text>
            <Text style={styles.message}>{i18n.t('profile__message__2')}</Text>
            <Text style={styles.message}>{i18n.t('profile__message__3')}</Text>
            <Text style={styles.message}>{i18n.t('profile__message__4')}</Text>
          </View>
        ) : null
      }
      refreshControl={
        <Refresher onRefresh={() => refetch()} refreshing={loading} />
      }
      renderItem={({ item }) => (
        <Touchable onPress={item.onPress} style={styles.item}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={[styles.label, item.warning && styles.warning]}>
            {item.label}
          </Text>
          {item.link && (
            <Image source={img_link} style={[styles.icon, styles.iconSmall]} />
          )}
          {item.loading && <ActivityIndicator color={colors.accent} />}
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
    ...typography.medium,
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
  },
  warning: {
    color: colors.state.warning
  }
})
