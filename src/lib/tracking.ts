import BackgroundGeolocation from 'react-native-background-geolocation'
import { TRACKING_API_URI } from 'react-native-dotenv'

import { storage } from './storage'

class Tracking {
  async init(): Promise<boolean> {
    const token = await storage.get('@token')

    if (!token) {
      return false
    }

    await BackgroundGeolocation.ready({
      autoSync: true,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      headers: {
        authorization: `Bearer ${token}`
      },
      startOnBoot: true,
      stopOnTerminate: false,
      url: `${TRACKING_API_URI}/track`
    })

    return true
  }

  async check(): Promise<boolean> {
    const { enabled } = await BackgroundGeolocation.getState()

    return enabled
  }

  async start(): Promise<boolean> {
    const { enabled } = await BackgroundGeolocation.start()

    return enabled
  }

  async stop(): Promise<boolean> {
    const { enabled } = await BackgroundGeolocation.stop()

    return enabled
  }
}

export const tracking = new Tracking()
