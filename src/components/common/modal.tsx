import React, { FunctionComponent } from 'react'
import { Modal as ReactNativeModal, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { colors, layout, typography } from '../../styles'
import { KeyboardView } from './keyboard-view'

interface Props {
  title: string
  visible: boolean

  onClose: () => void
}

export const Modal: FunctionComponent<Props> = ({
  children,
  onClose,
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
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
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
    backgroundColor: colors.primaryDark,
    borderTopLeftRadius: layout.radius,
    borderTopRightRadius: layout.radius,
    padding: layout.padding * 1.5
  },
  main: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    margin: layout.margin * 2,
    maxHeight: '70%',
    width: '70%'
  },
  modal: {
    alignItems: 'center',
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
