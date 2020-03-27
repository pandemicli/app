import { useLazyQuery } from '@apollo/react-hooks'
import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import {
  img_dark_clear,
  img_dark_search,
  img_light_clear,
  img_light_search
} from '../../assets'
import { SEARCH_PLACES } from '../../graphql/documents'
import { QuerySearchPlacesPayload } from '../../graphql/payload'
import {
  GooglePlace,
  LocationPoint,
  QuerySearchPlacesArgs
} from '../../graphql/types'
import { useDebounce } from '../../hooks'
import { colors, layout, typography } from '../../styles'
import { Modal } from './modal'
import { TextBox } from './text-box'
import { Touchable } from './touchable'

export type PickerItem = {
  label: string
  value: string
}

interface Props {
  location?: LocationPoint
  selected?: string
  visible: boolean

  onChange: (place: GooglePlace) => void
  onClose: () => void
}

export const LocationPicker: FunctionComponent<Props> = ({
  location,
  onChange,
  onClose,
  selected,
  visible
}) => {
  const [searchPlaces, { data, loading }] = useLazyQuery<
    QuerySearchPlacesPayload,
    QuerySearchPlacesArgs
  >(SEARCH_PLACES)

  const [query, setQuery] = useState('')

  const debounced = useDebounce(query, 300)

  useEffect(() => {
    if (debounced) {
      searchPlaces({
        variables: {
          location,
          query: debounced
        }
      })
    }
  }, [debounced, location, searchPlaces])

  const styles = useDynamicStyleSheet(stylesheet)
  const search = useDynamicValue(img_dark_search, img_light_search)
  const clear = useDynamicValue(img_dark_clear, img_light_clear)

  return (
    <Modal
      onClose={onClose}
      style={styles.modal}
      title="Find places"
      visible={visible}>
      <View style={styles.search}>
        <Image source={search} style={styles.icon} />
        <TextBox
          onChangeText={(query) => setQuery(query)}
          placeholder="Filter"
          style={styles.query}
          value={query}
        />
        {query.length > 0 && (
          <Touchable onPress={() => setQuery('')}>
            <Image source={clear} style={styles.icon} />
          </Touchable>
        )}
      </View>
      <FlatList
        data={data?.searchPlaces ?? []}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          loading ? (
            <ActivityIndicator color={colors.accent} style={styles.spinner} />
          ) : null
        }
        renderItem={({ item }) => (
          <Touchable
            onPress={() => {
              onChange(item)

              onClose()
            }}>
            <Text
              style={[styles.label, selected === item.id && styles.selected]}>
              {item.name}
            </Text>
          </Touchable>
        )}
      />
    </Modal>
  )
}

const stylesheet = new DynamicStyleSheet({
  icon: {
    height: layout.icon,
    margin: (layout.textBox - layout.icon) / 2,
    width: layout.icon
  },
  label: {
    ...typography.regular,
    color: colors.foreground,
    margin: layout.padding * 1.5
  },
  modal: {
    height: '70%'
  },
  query: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    flex: 1,
    paddingLeft: 0
  },
  search: {
    backgroundColor: colors.background,
    flexDirection: 'row'
  },
  selected: {
    color: colors.accent
  },
  separator: {
    backgroundColor: colors.background,
    height: StyleSheet.hairlineWidth
  },
  spinner: {
    margin: layout.margin
  }
})
