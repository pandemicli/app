import { DynamicValue } from 'react-native-dark-mode'

export const colors = {
  accent: '#8bc34a',
  actions: {
    edit: '#007aff',
    favorite: '#ffcc00',
    loading: '#000',
    remove: '#ff3b30'
  },
  background: new DynamicValue('#fff', '#000'),
  backgroundDark: new DynamicValue('#f6f7f8', '#111'),
  border: new DynamicValue('#ecf0f1', '#181818'),
  foreground: new DynamicValue('#000', '#fff'),
  foregroundLight: new DynamicValue('#666', '#ccc'),
  modal: new DynamicValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.9)'),
  primary: '#4caf50',
  primaryDark: '#2e7d32',
  state: {
    error: '#ff3b30',
    message: '#007aff',
    success: '#4cd964'
  }
}
