import phone from 'phone'
// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native'
import Contacts, { EmailAddress, PhoneNumber } from 'react-native-contacts'

import { i18n } from '../i18n'
import { PhoneContact } from '../types'
import { crypto } from './crypto'
import { dialog } from './dialog'

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
      Contacts.getAll(async (error, data) => {
        if (error) {
          dialog.error(error.message)

          reject()

          return
        }

        const contacts = await Promise.all(
          data.map(
            async ({
              emailAddresses,
              familyName,
              givenName,
              phoneNumbers,
              recordID
            }) => ({
              deviceIdHash: await crypto.hash(recordID),
              email: this.getEmail(emailAddresses),
              name: [givenName.trim(), familyName.trim()].join(' ').trim(),
              phone: this.getMobile(phoneNumbers)
            })
          )
        )

        resolve(contacts.filter(({ name }) => name))
      })
    })
  }

  private getEmail(emails: EmailAddress[]): string | undefined {
    console.log('emails', emails)

    const iCloud = emails.find(({ label }) => label === 'iCloud')?.email
    const home = emails.find(({ label }) => label === 'home')?.email

    if (iCloud) {
      return iCloud.toLowerCase()
    }

    if (home) {
      return home.toLowerCase()
    }

    return emails[0]?.email.toLowerCase()
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
