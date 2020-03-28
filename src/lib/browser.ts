import InAppBrowser from 'react-native-inappbrowser-reborn'

class Browser {
  async open(url: string) {
    const available = await InAppBrowser.isAvailable()

    if (available) {
      InAppBrowser.open(url)
    }
  }
}

export const browser = new Browser()
