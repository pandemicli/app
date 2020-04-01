import InAppBrowser from 'react-native-inappbrowser-reborn'

import { analytics } from './analytics'

class Browser {
  async open(uri: string): Promise<void> {
    const available = await InAppBrowser.isAvailable()

    if (available) {
      InAppBrowser.open(uri)
    }

    analytics.track('Link Opened', {
      uri
    })
  }
}

export const browser = new Browser()
