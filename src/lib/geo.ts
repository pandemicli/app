import Geolocation from '@react-native-community/geolocation'
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native'

import { LocationPoint } from '../graphql/types'
import { dialog } from './dialog'

class Location {
  async get(): Promise<LocationPoint> {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          buttonPositive: 'Okay',
          message: 'Share your location to find places near you.',
          title: 'Places'
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
