import { DialogProps } from '../components/common/dialog'
import { i18n } from '../i18n'
import { mitter } from './mitter'

class Dialog {
  alert(title: string, message: string): void {
    mitter.dialog({
      message,
      title,
      type: 'alert'
    })
  }

  error(message: string): void {
    this.alert(i18n.t('dialog__error__title'), message)
  }

  prompt(options: Partial<DialogProps>): Promise<string> {
    return new Promise((resolve) => {
      mitter.dialog({
        ...options,
        onValue: (value: string) => resolve(value),
        type: 'prompt'
      } as DialogProps)
    })
  }

  confirm(message: string, title?: string, positive = true): Promise<boolean> {
    return new Promise((resolve) => {
      mitter.dialog({
        message,
        onNo: () => resolve(false),
        onYes: () => resolve(true),
        positive,
        title: title ? title : i18n.t('dialog__confirm__title'),
        type: 'confirm'
      })
    })
  }
}

export const dialog = new Dialog()
