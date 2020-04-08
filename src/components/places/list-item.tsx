import React, { FunctionComponent } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { img_star } from '../../assets'
import { Place } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Image, Touchable } from '../common'

interface Props {
  favoriting: boolean
  item: Place

  onEdit: () => void
  onFavorite: () => void
}

export const ListItem: FunctionComponent<Props> = ({
  favoriting,
  item,
  onEdit,
  onFavorite
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.main}>
      <Touchable onPress={onEdit} style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
      </Touchable>
      <View style={styles.actions}>
        <Touchable onPress={onFavorite} style={styles.action}>
          {favoriting ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <Image
              source={img_star}
              style={[styles.icon, !item.favorite && styles.notFavorite]}
            />
          )}
        </Touchable>
      </View>
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.margin
  },
  actions: {
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  details: {
    flex: 1,
    padding: layout.margin
  },
  icon: {
    height: layout.icon * 0.75,
    width: layout.icon * 0.75
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row'
  },
  name: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  },
  notFavorite: {
    opacity: 0.25
  }
})
