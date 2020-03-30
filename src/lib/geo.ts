import Geolocation from '@react-native-community/geolocation'
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native'

import { i18n } from '../i18n'
import { LocationPoint } from '../types'
import { dialog } from './dialog'

class Location {
  async get(): Promise<LocationPoint> {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          buttonPositive: i18n.t('lib__geo__get__okay'),
          message: i18n.t('lib__geo__get__message'),
          title: i18n.t('lib__geo__get__title')
        }
      )
    }

    return new Promise((resolve) =>
      Geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) =>
          resolve({
            latitude,
            longitude
          }),
        (error) => {
          if (error) {
            dialog.error(error.message)
          }
        }
      )
    )
  }
}

export const geo = new Location()
