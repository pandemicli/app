import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect } from 'react'
import { SectionList, Text } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Refresher, Separator } from '../../components/common'
import { FeedFooter, FeedHeader, FeedItem } from '../../components/today'
import { TODAY_FEED } from '../../graphql/documents'
import { QueryTodayFeedPayload } from '../../graphql/payload'
import { Contact, Place, QueryTodayFeedArgs } from '../../graphql/types'
import { useToggleCheckIn, useToggleInteraction } from '../../hooks'
import { i18n } from '../../i18n'
import { TodayParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<TodayParamList, 'Feed'>
  route: RouteProp<TodayParamList, 'Feed'>
}

export const Feed: FunctionComponent<Props> = ({
  navigation: { navigate },
  route: {
    params: { date }
  }
}) => {
  const { data, loading, refetch } = useQuery<
    QueryTodayFeedPayload,
    QueryTodayFeedArgs
  >(TODAY_FEED, {
    variables: {
      date
    }
  })

  useEffect(() => {
    refetch({
      date
    })
  }, [date, refetch])

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
          {i18n.t('feed__message__tap__1')}
          <Text style={styles.more}>{i18n.t('label__more')}</Text>
          {i18n.t('feed__message__tap__3')}
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
