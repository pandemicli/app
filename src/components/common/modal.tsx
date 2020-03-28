import React, { FunctionComponent } from 'react'
import { Modal as ReactNativeModal, Text, View, ViewStyle } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { img_dark_close } from '../../assets'
import { colors, layout, typography } from '../../styles'
import { Image } from './image'
import { KeyboardView } from './keyboard-view'
import { Touchable } from './touchable'

interface Props {
  title: string
  visible: boolean
  style?: ViewStyle

  onClose: () => void
}

export const Modal: FunctionComponent<Props> = ({
  children,
  onClose,
  style,
  title,
  visible
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <ReactNativeModal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <KeyboardView>
        <View style={styles.modal}>
          <View style={[styles.main, style]}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Touchable onPress={onClose}>
                <Image source={img_dark_close} style={styles.icon} />
              </Touchable>
            </View>
            {children}
          </View>
        </View>
      </KeyboardView>
    </ReactNativeModal>
  )
}

const stylesheet = new DynamicStyleSheet({
  header: {
    backgroundColor: colors.accent,
    borderTopEndRadius: layout.radius,
    borderTopStartRadius: layout.radius,
    flexDirection: 'row'
  },
  icon: {
    height: layout.icon,
    margin: layout.margin,
    width: layout.icon
  },
  main: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    margin: layout.margin * 2,
    maxHeight: '80%',
    overflow: 'hidden',
    width: '80%'
  },
  modal: {
    alignItems: 'center',
    backgroundColor: colors.modal,
    borderColor: colors.border,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    ...typography.regular,
    ...typography.medium,
    color: colors.black,
    flex: 1,
    margin: layout.margin
  }
})
