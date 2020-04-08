import { DynamicValue } from 'react-native-dark-mode'

export const colors = {
  accent: '#8bc34a',
  background: new DynamicValue('#fff', '#000'),
  backgroundDark: new DynamicValue('#ecf0f1', '#222'),
  black: '#000',
  border: new DynamicValue('#e0e0e0', '#181818'),
  foreground: new DynamicValue('#000', '#fff'),
  foregroundLight: new DynamicValue('#666', '#ccc'),
  modal: new DynamicValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.9)'),
  primary: '#4caf50',
  primaryDark: '#2e7d32',
  state: {
    error: '#ff3b30',
    message: '#007aff',
    success: '#4cd964',
    warning: '#ff9500'
  },
  white: '#fff'
}
