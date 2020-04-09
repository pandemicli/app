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

export interface PushNotification {
  body: string
  title: string
}
