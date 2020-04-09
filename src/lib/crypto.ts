import AsyncStorage from '@react-native-community/async-storage'
import { EThree } from '@virgilsecurity/e3kit-native'
import { API_URI } from 'react-native-dotenv'
import { JSHash } from 'react-native-hash'

class Crypto {
  private client?: EThree

  async init(token: string): Promise<void> {
    this.client = await EThree.initialize(
      async () => {
        const uri = API_URI.replace('graphql', 'virgil-jwt')

        const response = await fetch(uri, {
          headers: {
            authorization: `Bearer ${token}`
          },
          method: 'GET'
        })

        const { virgilToken } = await response.json()

        return virgilToken
      },
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        AsyncStorage
      }
    )
  }

  async register(): Promise<void> {
    if (this.client) {
      return this.client.register()
    }
  }

  async remove(): Promise<void> {
    if (this.client) {
      return this.client.unregister()
    }
  }

  async reset(): Promise<void> {
    if (this.client) {
      return this.client.cleanup()
    }
  }

  async backupKey(password: string): Promise<void> {
    if (!this.client) {
      throw new Error('Encryption not initialised')
    }

    await this.client.backupPrivateKey(password)
  }

  async fetchKey(password: string): Promise<void> {
    if (!this.client) {
      throw new Error('Encryption not initialised')
    }

    const exists = await this.client.hasLocalPrivateKey()

    if (!exists) {
      await this.client.restorePrivateKey(password)
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!this.client) {
      throw new Error('Encryption not initialised')
    }

    await this.client.changePassword(oldPassword, newPassword)
  }

  hash(data: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return JSHash(data, 'sha256')
  }

  encrypt(data: string): Promise<string> {
    if (!this.client) {
      throw new Error('Encryption not initialised')
    }

    return this.client.authEncrypt(data) as Promise<string>
  }

  decrypt(data: string): Promise<string> {
    if (!this.client) {
      throw new Error('Encryption not initialised')
    }

    return this.client.authDecrypt(data) as Promise<string>
  }
}

export const crypto = new Crypto()
