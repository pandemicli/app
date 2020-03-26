import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { orderBy } from 'lodash'
import React, { FunctionComponent, useEffect } from 'react'
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
import { useContacts } from '../../hooks'
import { phoneBook } from '../../lib'
import { ContactsParamList } from '../../navigators'
import { layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ContactsParamList, 'Contacts'>
  route: RouteProp<ContactsParamList, 'Contacts'>
}

export const Contacts: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions }
}) => {
  const {
    data,
    favoriting,
    loading,
    refetch,
    remove,
    removing,
    sync,
    syncing,
    toggleFavorite
  } = useContacts()

  const styles = useDynamicStyleSheet(stylesheet)
  const add = useDynamicValue(img_dark_add, img_light_add)
  const syncIcon = useDynamicValue(img_dark_sync, img_light_sync)

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            <>
              <HeaderButton
                icon={syncIcon}
                onPress={async () => {
                  if (syncing) {
                    return
                  }

                  const contacts = await phoneBook.get()

                  sync(contacts)
                }}
              />
              <HeaderButton icon={add} onPress={() => navigate('AddContact')} />
            </>
          }
        />
      )
    })
  }, [add, navigate, setOptions, sync, syncIcon, syncing])

  return (
    <SwipeListView
      closeOnRowBeginSwipe
      contentContainerStyle={styles.list}
      data={orderBy(data?.contacts, ['favorite', 'name'], ['desc', 'asc'])}
      disableLeftSwipe
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.id}
      leftOpenValue={layout.icon * 3 + layout.margin * 3 * 2}
      ListEmptyComponent={<ListEmpty onPress={() => navigate('AddContact')} />}
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
    />
  )
}

const stylesheet = new DynamicStyleSheet({
  list: {
    flexGrow: 1
  }
})
