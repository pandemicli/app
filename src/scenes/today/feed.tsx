import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect } from 'react'
import { SectionList, Text } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Refresher, Separator } from '../../components/common'
import { FeedFooter, FeedHeader, FeedItem } from '../../components/today'
import { Contact, Place } from '../../graphql/types'
import { useToday, useToggleCheckIn, useToggleInteraction } from '../../hooks'
import { i18n } from '../../i18n'
import { analytics } from '../../lib'
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
  const { contacts, loading, places, refetch } = useToday(date)

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
      data: contacts,
      title: 'Contacts'
    },
    {
      data: places,
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
          onPress={() => {
            if (item.__typename === 'Contact') {
              toggleInteraction(item.id)

              analytics.track(
                item.interactedToday
                  ? 'Interaction Removed'
                  : 'Interaction Added'
              )
            } else if (item.__typename === 'Place') {
              toggleCheckIn(item.id)

              analytics.track(
                item.checkedInToday ? 'Check In Removed' : 'Check In Added'
              )
            }
          }}
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
