import phone from 'phone'
// eslint-disable-next-line react-native/split-platform-components
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import Contacts, { PhoneNumber } from 'react-native-contacts'

import { i18n } from '../i18n'
import { PhoneContact } from '../types'

class PhoneBook {
  async get(): Promise<PhoneContact[]> {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          buttonPositive: i18n.t('lib__phone_book__get__okay'),
          message: i18n.t('lib__phone_book__get__message'),
          title: i18n.t('lib__phone_book__get__title')
        }
      )
    }

    return new Promise((resolve, reject) => {
      Contacts.getAll((error, data) => {
        if (error) {
          Alert.alert('Error', error.message)

          reject()

          return
        }

        const contacts = data
          .map(({ familyName, givenName, phoneNumbers, recordID }) => ({
            deviceId: recordID,
            name: [givenName.trim(), familyName.trim()].join(' ').trim(),
            phone: this.getMobile(phoneNumbers)
          }))
          .filter(({ name }) => name)

        resolve(contacts)
      })
    })
  }

  private getMobile(numbers: PhoneNumber[]): string | undefined {
    const iPhone = numbers.find(({ label }) => label === 'iPhone')?.number
    const mobile = numbers.find(({ label }) => label === 'mobile')?.number

    if (iPhone) {
      const [number] = phone(iPhone)

      return number
    }

    if (mobile) {
      const [number] = phone(mobile)

      return number
    }
  }
}

export const phoneBook = new PhoneBook()
