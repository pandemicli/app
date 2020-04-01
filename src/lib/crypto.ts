import { sha256 } from 'react-native-sha256'
import SimpleCrypto from 'simple-crypto-js'

class Crypto {
  private client?: SimpleCrypto

  init(userId: string): void {
    this.client = new SimpleCrypto(userId)
  }

  reset() {
    this.client = undefined
  }

  hash(data: string): Promise<string> {
    return sha256(data)
  }

  encrypt(data: string): string {
    if (this.client) {
      return this.client.encrypt(data)
    }

    throw new Error('Encryption not initialised')
  }

  decrypt(data: string): string {
    if (this.client) {
      return this.client.decrypt(data) as string
    }

    throw new Error('Encryption not initialised')
  }
}

export const crypto = new Crypto()
