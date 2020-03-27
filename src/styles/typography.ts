import { TextStyle } from 'react-native'

export const typography: Record<string, TextStyle> = {
  bold: {
    fontFamily: 'Inter-SemiBold'
  },
  footnote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 12 * 1.5
  },
  medium: {
    fontFamily: 'Inter-Medium'
  },
  paragraph: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 16 * 1.5
  },
  regular: {
    fontFamily: 'Inter-Regular',
    fontSize: 16
  },
  small: {
    fontFamily: 'Inter-Regular',
    fontSize: 12
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 20
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24
  }
}
