import segment, { JsonMap } from '@segment/analytics-react-native'
import { SEGMENT_KEY } from 'react-native-dotenv'

class Analytics {
  constructor() {
    segment.setup(SEGMENT_KEY, {
      trackAppLifecycleEvents: true
    })

    if (__DEV__) {
      segment.disable()
    }
  }

  identify(id: string): Promise<void> {
    return segment.identify(id)
  }

  screen(name: string): Promise<void> {
    return segment.screen(name)
  }

  track(name: string, props?: JsonMap): Promise<void> {
    return segment.track(name, props)
  }

  reset(): Promise<void> {
    return segment.reset()
  }
}

export const analytics = new Analytics()
