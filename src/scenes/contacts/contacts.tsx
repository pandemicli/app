import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'
import {
  ActivityIndicator,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  Text
} from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import {
  img_dark_add,
  img_dark_sync,
  img_light_add,
  img_light_sync
} from '../../assets'
import {
  Header,
  HeaderButton,
  Refresher,
  Separator
} from '../../components/common'
import { ListEmpty, ListItem } from '../../components/contacts'
import { Contact } from '../../graphql/types'
import { useContactActions, useContacts } from '../../hooks'
import { i18n } from '../../i18n'
import { analytics, phoneBook } from '../../lib'
import { ContactsParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ContactsParamList, 'Contacts'>
  route: RouteProp<ContactsParamList, 'Contacts'>
}

export const Contacts: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions }
}) => {
  const { contacts, loading, refetch } = useContacts()
  const { favoriting, sync, syncing, toggleFavorite } = useContactActions()

  const styles = useDynamicStyleSheet(stylesheet)
  const img_add = useDynamicValue(img_dark_add, img_light_add)
  const img_sync = useDynamicValue(img_dark_sync, img_light_sync)

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            <>
              {syncing ? (
                <ActivityIndicator
                  color={colors.primary}
                  style={styles.spinner}
                />
              ) : (
                <HeaderButton
                  icon={img_sync}
                  onPress={async () => {
                    if (syncing) {
                      return
                    }

                    const contacts = await phoneBook.get()

                    sync(contacts)

                    analytics.track('Contacts Synced', {
                      count: contacts.length
                    })
                  }}
                />
              )}
              <HeaderButton
                icon={img_add}
                onPress={() => navigate('AddContact')}
              />
            </>
          }
        />
      )
    })
  }, [img_add, img_sync, navigate, setOptions, styles.spinner, sync, syncing])

  const favorites = contacts.filter(({ favorite }) => favorite)
  const others = contacts.filter(({ favorite }) => !favorite)

  const sections: SectionListData<Contact>[] = []

  if (favorites.length > 0) {
    sections.push({
      data: favorites,
      key: i18n.t('title__favorites')
    })
  }

  if (others.length > 0) {
    sections.push({
      data: others,
      key: i18n.t('title__others')
    })
  }

  const renderItem: SectionListRenderItem<Contact> = ({ item }) => (
    <ListItem
      favoriting={favoriting.get(item.id)}
      item={item}
      onEdit={() =>
        navigate('EditContact', {
          contact: item
        })
      }
      onFavorite={() => {
        toggleFavorite(item.id)

        analytics.track(
          item.favorite ? 'Contact Unfavorited' : 'Contact Favorited'
        )
      }}
    />
  )

  return (
    <SectionList
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={<ListEmpty onPress={() => navigate('AddContact')} />}
      ListHeaderComponent={
        <>
          <Text style={styles.message}>{i18n.t('contacts__message__tap')}</Text>
          {sections.length === 0 && <Separator />}
        </>
      }
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
      removeClippedSubviews
      renderItem={renderItem}
      renderSectionHeader={({ section }) =>
        section.data.length > 0 ? (
          <Text style={styles.header}>{section.key}</Text>
        ) : null
      }
      sections={sections}
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  header: {
    ...typography.small,
    ...typography.medium,
    backgroundColor: colors.backgroundDark,
    color: colors.foregroundLight,
    flex: 1,
    padding: layout.margin
  },
  list: {
    flexGrow: 1
  },
  message: {
    ...typography.footnote,
    color: colors.foregroundLight,
    margin: layout.margin,
    textAlign: 'center'
  },
  spinner: {
    margin: layout.margin
  }
})
