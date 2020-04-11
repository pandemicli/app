export interface PhoneContact {
  deviceIdHash: string
  email?: string
  emailHash?: string
  name: string
  phone?: string
  phoneHash?: string
}

export interface LocationPoint {
  latitude: number
  longitude: number
}

export interface NotificationPayload {
  body: string
  title: string
  type: 'push' | 'error'
}
