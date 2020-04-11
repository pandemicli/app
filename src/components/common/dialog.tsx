import React, { FunctionComponent, useEffect, useState } from 'react'
import { Modal, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { i18n } from '../../i18n'
import { mitter } from '../../lib'
import { colors, layout, typography } from '../../styles'
import { Button } from './button'
import { KeyboardView } from './keyboard-view'
import { TextBox } from './text-box'

export interface DialogProps {
  defaultValue?: string
  inputType?: 'email' | 'number' | 'password' | 'text'
  labelNegative?: string
  labelPositive?: string
  message: string
  placeholder?: string
  positive?: boolean
  title: string
  type: 'alert' | 'confirm' | 'prompt'

  onNo?: () => void
  onValue?: (value: string) => void
  onYes?: () => void
}

export const Dialog: FunctionComponent = () => {
  const [props, setProps] = useState<DialogProps | null>(null)

  const [value, setValue] = useState('')

  useEffect(() => {
    mitter.onDialog((props) => setProps(props))
  }, [])

  const styles = useDynamicStyleSheet(stylesheet)

  if (!props) {
    return null
  }

  const {
    defaultValue,
    inputType,
    labelNegative,
    labelPositive,
    message,
    onNo,
    onValue,
    onYes,
    placeholder,
    positive,
    title,
    type
  } = props

  return (
    <Modal animationType="fade" transparent>
      <KeyboardView>
        <View style={styles.modal}>
          <View style={styles.main}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.content}>
              <Text style={styles.message}>{message}</Text>
              {type === 'prompt' && (
                <TextBox
                  defaultValue={defaultValue}
                  keyboardType={
                    inputType === 'email'
                      ? 'email-address'
                      : inputType === 'number'
                      ? 'decimal-pad'
                      : 'default'
                  }
                  onChangeText={(value) => setValue(value)}
                  placeholder={placeholder}
                  secureTextEntry={inputType === 'password'}
                  style={styles.input}
                  value={value}
                />
              )}
            </View>
            <View style={styles.footer}>
              {type === 'confirm' ? (
                <>
                  <Button
                    label={labelNegative ?? i18n.t('dialog__label__no')}
                    onPress={() => {
                      if (onNo) {
                        onNo()
                      }

                      setProps(null)
                    }}
                    style={styles.button}
                    styleLabel={
                      positive
                        ? styles.buttonLabelNegative
                        : styles.buttonLabelPositive
                    }
                  />
                  <View style={styles.separator} />
                  <Button
                    label={labelPositive ?? i18n.t('dialog__label__yes')}
                    onPress={() => {
                      if (onYes) {
                        onYes()
                      }

                      setProps(null)
                    }}
                    style={styles.button}
                    styleLabel={
                      positive
                        ? styles.buttonLabelPositive
                        : styles.buttonLabelNegative
                    }
                  />
                </>
              ) : type === 'prompt' ? (
                <>
                  <Button
                    label={labelNegative ?? i18n.t('dialog__label__cancel')}
                    onPress={() => setProps(null)}
                    style={styles.button}
                    styleLabel={
                      positive
                        ? styles.buttonLabelNegative
                        : styles.buttonLabelPositive
                    }
                  />
                  <View style={styles.separator} />
                  <Button
                    label={labelPositive ?? i18n.t('dialog__label__submit')}
                    onPress={() => {
                      if (value) {
                        if (onValue) {
                          onValue(value)
                        }

                        setProps(null)
                        setValue('')
                      }
                    }}
                    style={styles.button}
                    styleLabel={
                      positive
                        ? styles.buttonLabelPositive
                        : styles.buttonLabelNegative
                    }
                  />
                </>
              ) : (
                <Button
                  label={i18n.t('dialog__label__okay')}
                  onPress={() => setProps(null)}
                  style={styles.button}
                  styleLabel={styles.buttonLabel}
                />
              )}
            </View>
          </View>
        </View>
      </KeyboardView>
    </Modal>
  )
}

const stylesheet = new DynamicStyleSheet({
  button: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 0,
    flex: 1
  },
  buttonLabel: {
    color: colors.state.message
  },
  buttonLabelNegative: {
    color: colors.state.error
  },
  buttonLabelPositive: {
    color: colors.state.success
  },
  content: {
    borderBottomColor: colors.border,
    borderBottomWidth: layout.border,
    borderTopColor: colors.border,
    borderTopWidth: layout.border,
    padding: layout.margin
  },
  footer: {
    flexDirection: 'row'
  },
  input: {
    backgroundColor: colors.background,
    marginTop: layout.margin
  },
  main: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    overflow: 'hidden',
    width: '70%'
  },
  message: {
    ...typography.paragraph,
    color: colors.foreground,
    textAlign: 'center'
  },
  modal: {
    alignItems: 'center',
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'center'
  },
  separator: {
    backgroundColor: colors.border,
    width: layout.border
  },
  title: {
    ...typography.subtitle,
    color: colors.accent,
    padding: layout.margin,
    textAlign: 'center'
  }
})
