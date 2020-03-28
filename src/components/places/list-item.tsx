import React, { FunctionComponent } from 'react'
import { Text, View } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { img_dark_star, img_light_star } from '../../assets'
import { Place } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Image } from '../common'

interface Props {
  item: Place
}

export const ListItem: FunctionComponent<Props> = ({ item }) => {
  const styles = useDynamicStyleSheet(stylesheet)
  const img_star = useDynamicValue(img_dark_star, img_light_star)

  return (
    <View style={styles.main}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      {item.favorite && <Image source={img_star} style={styles.icon} />}
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  details: {
    flex: 1
  },
  icon: {
    height: layout.icon * 0.75,
    width: layout.icon * 0.75
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    padding: layout.margin
  },
  name: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  }
})
