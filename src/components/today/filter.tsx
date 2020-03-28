import React, { FunctionComponent } from 'react'
import { Image, View } from 'react-native'
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
import { TextBox, Touchable } from '../common'

interface Props {
  query: string

  onChange: (query: string) => void
}

export const Filter: FunctionComponent<Props> = ({ onChange, query }) => {
  const styles = useDynamicStyleSheet(stylesheet)
  const img_clear = useDynamicValue(img_dark_clear, img_light_clear)
  const img_search = useDynamicValue(img_dark_search, img_light_search)

  return (
    <View style={styles.main}>
      <Image source={img_search} style={styles.icon} />
      <TextBox
        onChangeText={(query) => onChange(query)}
        placeholder="Filter"
        style={styles.query}
        value={query}
      />
      {query.length > 0 && (
        <Touchable onPress={() => onChange('')}>
          <Image source={img_clear} style={styles.icon} />
        </Touchable>
      )}
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  icon: {
    height: layout.icon,
    margin: layout.margin,
    width: layout.icon
  },
  main: {
    alignItems: 'stretch',
    backgroundColor: colors.backgroundDark,
    flexDirection: 'row'
  },
  query: {
    ...typography.small,
    backgroundColor: 'transparent',
    borderRadius: 0,
    flex: 1,
    height: layout.icon + layout.margin * 2,
    paddingLeft: 0
  }
})
