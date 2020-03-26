import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import QRCode from 'react-native-qrcode-svg'

import { Button, Refresher, Spinner } from '../../components/common'
import { PROFILE } from '../../graphql/documents'
import { QueryProfilePayload } from '../../graphql/payload'
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

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.main}
        refreshControl={
          <Refresher onRefresh={() => refetch()} refreshing={loading} />
        }>
        {(loading || !data) && <Spinner />}
        {data && (
          <View style={styles.content}>
            <View style={styles.qr}>
              <QRCode
                backgroundColor="#fff"
                size={width / 3}
                value={data.profile.id}
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
        )}
      </ScrollView>
      <Button
        label="Sign out"
        onPress={() => signOut()}
        style={styles.signOut}
        styleLabel={styles.signOutLabel}
      />
    </>
  )
}

const stylesheet = new DynamicStyleSheet({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.margin * 2
  },
  greeting: {
    ...typography.subtitle,
    color: colors.foreground,
    marginTop: layout.margin * 2,
    textAlign: 'center'
  },
  main: {
    flex: 1,
    padding: layout.margin
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
  signOut: {
    backgroundColor: colors.backgroundDark,
    margin: layout.margin
  },
  signOutLabel: {
    color: colors.actions.favorite
  }
})
