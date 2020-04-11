import mitt from 'mitt'

import { DialogProps } from '../components/common/dialog'
import { NotificationPayload } from '../types'

class Mitter {
  mitter = mitt()

  logout() {
    this.mitter.emit('logout')
  }

  onLogout(handler: mitt.Handler) {
    this.mitter.on('logout', handler)
  }

  error(notification: NotificationPayload) {
    this.mitter.emit('error', notification)
  }

  onError(handler: mitt.Handler) {
    this.mitter.on('error', handler)
  }

  dialog(options: DialogProps) {
    this.mitter.emit('dialog', options)
  }

  onDialog(handler: mitt.Handler) {
    this.mitter.on('dialog', handler)
  }

  loading(loading: boolean) {
    this.mitter.emit('loading', loading)
  }

  onLoading(handler: mitt.Handler) {
    this.mitter.on('loading', handler)
  }
}

export const mitter = new Mitter()
