import React, { FunctionComponent } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

export const KeyboardView: FunctionComponent = ({ children }) => (
  <KeyboardAvoidingView
    behavior="padding"
    enabled={Platform.OS === 'ios'}
    style={styles.main}>
    {children}
  </KeyboardAvoidingView>
)

const styles = StyleSheet.create({
  main: {
    flex: 1
  }
})
