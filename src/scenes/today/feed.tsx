import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import moment from 'moment'
import React, { createRef, FunctionComponent } from 'react'
import { SectionList, Text } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Refresher, Separator } from '../../components/common'
import { FeedFooter, FeedHeader, FeedItem } from '../../components/today'
import { TODAY_FEED } from '../../graphql/documents'
import { QueryTodayFeedPayload } from '../../graphql/payload'
import { Contact, Place, QueryTodayFeedArgs } from '../../graphql/types'
import { useToggleCheckIn, useToggleInteraction } from '../../hooks'
import { TodayParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<TodayParamList, 'Feed'>
  route: RouteProp<TodayParamList, 'Feed'>
}

export const Feed: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const date = moment().startOf('day').toISOString()

  const { data, loading, refetch } = useQuery<
    QueryTodayFeedPayload,
    QueryTodayFeedArgs
  >(TODAY_FEED, {
    variables: {
      date
    }
  })

  const { toggleCheckIn, togglingCheckIn } = useToggleCheckIn(date)
  const { toggleInteraction, togglingInteraction } = useToggleInteraction(date)

  const list = createRef<SectionList<Contact | Place>>()

  const styles = useDynamicStyleSheet(stylesheet)

  const sections = [
    {
      data: data?.todayFeed.contacts ?? [],
      title: 'Contacts'
    },
    {
      data: data?.todayFeed.places ?? [],
      title: 'Places'
    }
  ]

  return (
    <SectionList
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={
        <Text style={styles.message}>
          You can tap <Text style={styles.more}>More</Text> to view the full
          list.
        </Text>
      }
      ref={list}
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
      renderItem={({ item }) => (
        <FeedItem
          item={item}
          loading={
            item.__typename === 'Contact'
              ? togglingInteraction.get(item.id)
              : togglingCheckIn.get(item.id)
          }
          onPress={() =>
            item.__typename === 'Contact'
              ? toggleInteraction(item.id)
              : toggleCheckIn(item.id)
          }
        />
      )}
      renderSectionFooter={({ section }) => (
        <FeedFooter
          onAddContact={() => navigate('Contacts')}
          onAddPlace={() => navigate('Places')}
          section={section}
        />
      )}
      renderSectionHeader={({ section }) => (
        <FeedHeader
          onPress={() =>
            navigate(
              section.title === 'Contacts' ? 'Interactions' : 'CheckIns',
              {
                date
              }
            )
          }
          section={section}
        />
      )}
      sections={sections}
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  list: {
    flexGrow: 1
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    margin: layout.margin,
    textAlign: 'center'
  },
  more: {
    ...typography.medium,
    color: colors.accent
  }
})
