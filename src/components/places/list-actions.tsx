import React, { FunctionComponent } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import {
  img_action_edit,
  img_action_favorite,
  img_action_remove
} from '../../assets'
import { colors, layout } from '../../styles'
import { Image, Touchable } from '../common'

interface Props {
  favoriting: boolean
  removing: boolean

  onEdit: () => void
  onFavorite: () => void
  onRemove: () => void
}

export const ListActions: FunctionComponent<Props> = ({
  favoriting,
  onEdit,
  onFavorite,
  onRemove,
  removing
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.main}>
      <Touchable onPress={onFavorite} style={[styles.action, styles.favorite]}>
        {favoriting ? (
          <ActivityIndicator color={colors.actions.loading} />
        ) : (
          <Image source={img_action_favorite} style={styles.icon} />
        )}
      </Touchable>
      <Touchable onPress={onEdit} style={[styles.action, styles.edit]}>
        <Image source={img_action_edit} style={styles.icon} />
      </Touchable>
      <Touchable onPress={onRemove} style={[styles.action, styles.remove]}>
        {removing ? (
          <ActivityIndicator color={colors.actions.loading} />
        ) : (
          <Image source={img_action_remove} style={styles.icon} />
        )}
      </Touchable>
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  action: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.margin
  },
  edit: {
    backgroundColor: colors.actions.edit
  },
  favorite: {
    backgroundColor: colors.actions.favorite
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  main: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'row'
  },
  remove: {
    backgroundColor: colors.actions.remove
  }
})
