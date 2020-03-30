import { sha256 } from 'react-native-sha256'
import SimpleCrypto from 'simple-crypto-js'

class Crypto {
  client!: SimpleCrypto

  init(userId: string): void {
    this.client = new SimpleCrypto(userId)
  }

  hash(data: string): Promise<string> {
    return sha256(data)
  }

  encrypt(data: string): string {
    return this.client.encrypt(data)
  }

  decrypt(data: string): string {
    return this.client.decrypt(data) as string
  }
}

export const crypto = new Crypto()
