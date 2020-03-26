import { Platform, TextStyle } from 'react-native'

export const typography: Record<string, TextStyle> = {
  bold: {
    fontWeight: '600'
  },
  footnote: {
    fontFamily: 'Inter V',
    fontSize: 12,
    lineHeight: 12 * 1.5
  },
  medium: {
    fontWeight: Platform.select({
      android: 'bold',
      ios: '500'
    })
  },
  paragraph: {
    fontFamily: 'Inter V',
    fontSize: 16,
    lineHeight: 16 * 1.5
  },
  regular: {
    fontFamily: 'Inter V',
    fontSize: 16
  },
  small: {
    fontFamily: 'Inter V',
    fontSize: 12
  },
  subtitle: {
    fontFamily: 'Inter V',
    fontSize: 20,
    fontWeight: Platform.select({
      android: '600',
      ios: '500'
    })
  },
  title: {
    fontFamily: 'Inter V',
    fontSize: 24,
    fontWeight: Platform.select({
      android: 'bold',
      ios: '600'
    })
  }
}
