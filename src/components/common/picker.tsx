import React, { FunctionComponent, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
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
import { colors, layout, typography } from '../../styles'
import { Modal } from './modal'
import { TextBox } from './text-box'
import { Touchable } from './touchable'

export type PickerItem = {
  label: string
  value: string
}

interface Props {
  data: PickerItem[]
  selected?: PickerItem
  title: string
  visible: boolean

  keyExtractor?: (item: PickerItem) => string
  onChange: (item: PickerItem) => void
  onClose: () => void
}

export const Picker: FunctionComponent<Props> = ({
  data,
  keyExtractor,
  onChange,
  onClose,
  selected,
  title,
  visible
}) => {
  const [query, setQuery] = useState('')

  const styles = useDynamicStyleSheet(stylesheet)
  const search = useDynamicValue(img_dark_search, img_light_search)
  const clear = useDynamicValue(img_dark_clear, img_light_clear)

  return (
    <Modal onClose={onClose} title={title} visible={visible}>
      {data.length > 10 && (
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
      )}
      <FlatList
        data={data.filter(({ label }) =>
          label.toLowerCase().includes(query.toLowerCase())
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="always"
        keyExtractor={keyExtractor ? keyExtractor : (item) => item.value}
        renderItem={({ item }) => (
          <Touchable
            onPress={() => {
              onChange(item)
              onClose()
            }}>
            <Text
              style={[
                styles.label,
                selected?.value === item.value && styles.selected
              ]}>
              {item.label}
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
  }
})
