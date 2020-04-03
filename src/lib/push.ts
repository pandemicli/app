import { NativeEventEmitter, NativeModules } from 'react-native'

const { PushManager } = NativeModules

class Push {
  emitter = new NativeEventEmitter(PushManager)

  setup() {
    this.emitter.addListener('NotificationReceived', (data) => {
      console.log('notification', data)
    })
  }

  destroy() {
    this.emitter.removeAllListeners('NotificationReceived')
  }

  enableDailyReminder(title: string, body: string): void {
    PushManager.enableDailyReminder(title, body)
  }

  disableDailyReminder(): void {
    PushManager.disableDailyReminder()
  }
}

export const push = new Push()
