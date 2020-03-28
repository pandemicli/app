import { useQuery } from '@apollo/react-hooks'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { orderBy } from 'lodash'
import React, { FunctionComponent, useEffect } from 'react'
import { Text } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import { SwipeListView } from 'react-native-swipe-list-view'

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
import { ListActions, ListEmpty, ListItem } from '../../components/contacts'
import { CONTACTS } from '../../graphql/documents'
import { QueryContactsPayload } from '../../graphql/payload'
import { useContacts } from '../../hooks'
import { phoneBook } from '../../lib'
import { ContactsParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ContactsParamList, 'Contacts'>
  route: RouteProp<ContactsParamList, 'Contacts'>
}

export const Contacts: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions }
}) => {
  const { data, loading, refetch } = useQuery<QueryContactsPayload>(CONTACTS)

  const {
    favoriting,
    remove,
    removing,
    sync,
    syncing,
    toggleFavorite
  } = useContacts()

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
              <HeaderButton
                icon={img_sync}
                onPress={async () => {
                  if (syncing) {
                    return
                  }

                  const contacts = await phoneBook.get()

                  sync(contacts)
                }}
              />
              <HeaderButton
                icon={img_add}
                onPress={() => navigate('AddContact')}
              />
            </>
          }
        />
      )
    })
  }, [img_add, img_sync, navigate, setOptions, sync, syncing])

  const contacts = orderBy(
    data?.contacts,
    ['favorite', 'name'],
    ['desc', 'asc']
  )

  const favorites = contacts.filter(({ favorite }) => favorite)
  const others = contacts.filter(({ favorite }) => !favorite)

  const sections = [
    {
      data: favorites,
      title: 'Favorites'
    },
    {
      data: others,
      title: 'Others'
    }
  ]

  return (
    <SwipeListView
      closeOnRowBeginSwipe
      contentContainerStyle={styles.list}
      disableLeftSwipe
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.id}
      leftOpenValue={layout.icon * 3 + layout.margin * 3 * 2}
      ListEmptyComponent={<ListEmpty onPress={() => navigate('AddContact')} />}
      ListFooterComponent={
        contacts.length > 0 ? (
          <>
            <Separator />
            <Text style={styles.message}>
              Swipe right to view more options for a contact.
            </Text>
          </>
        ) : null
      }
      ListHeaderComponent={
        <Text style={styles.message}>
          You can tap the sync icon on the top right{'\n'}to sync all your phone
          contacts.
        </Text>
      }
      recalculateHiddenLayout
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
      renderHiddenItem={({ item }, map) => (
        <ListActions
          favoriting={favoriting}
          onEdit={() => {
            navigate('EditContact', {
              contact: item
            })

            map[item.id].closeRow()
          }}
          onFavorite={() => toggleFavorite(item.id, map[item.id])}
          onRemove={() => remove(item.id, map[item.id])}
          removing={removing}
        />
      )}
      renderItem={({ item }) => <ListItem item={item} />}
      renderSectionHeader={({ section }) =>
        section.data.length > 0 ? (
          <Text style={styles.header}>{section.title}</Text>
        ) : null
      }
      sections={sections}
      useSectionList
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
  }
})
