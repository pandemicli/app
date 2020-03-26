import phone from 'phone'
// eslint-disable-next-line react-native/split-platform-components
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import Contacts, { PhoneNumber } from 'react-native-contacts'

import { PhoneContact } from '../types'

class PhoneBook {
  async get(): Promise<PhoneContact[]> {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          buttonPositive: 'Yes',
          message:
            "Sync your contacts so you can track who you've met with recently.",
          title: 'Contacts'
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

        const contacts = data.map(
          ({ familyName, givenName, phoneNumbers, recordID }) => ({
            deviceId: recordID,
            name: [givenName, familyName].join(' '),
            phone: this.getMobile(phoneNumbers)
          })
        )

        resolve(contacts)
      })
    })
  }

  private getMobile(numbers: PhoneNumber[]): string | undefined {
    const mobile = numbers.find(({ label }) => label === 'mobile')?.number

    if (mobile) {
      const [number] = phone(mobile)

      return number
    }
  }
}

export const phoneBook = new PhoneBook()
