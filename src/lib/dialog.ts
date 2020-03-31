import { Alert } from 'react-native'

import { i18n } from '../i18n'

class Dialog {
  error(message: string): void {
    Alert.alert(i18n.t('lib__dialog__error__title'), message)
  }

  confirm(message: string, title?: string, invert?: boolean): Promise<boolean> {
    return new Promise((resolve) =>
      Alert.alert(
        title ? title : i18n.t('lib__dialog__confirm__title'),
        message,
        [
          {
            onPress: () => resolve(false),
            style: invert ? 'destructive' : 'cancel',
            text: i18n.t('lib__dialog__confirm__no')
          },
          {
            onPress: () => resolve(true),
            style: invert ? 'default' : 'destructive',
            text: i18n.t('lib__dialog__confirm__yes')
          }
        ]
      )
    )
  }
}

export const dialog = new Dialog()
