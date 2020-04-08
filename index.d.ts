declare module '*.png'

declare module 'react-native-dotenv' {
  export const API_URI: string
  export const TRACKING_API_URI: string

  export const CODE_PUSH_KEY_ANDROID: string
  export const CODE_PUSH_KEY_IOS: string

  export const SEGMENT_KEY: string
  export const SENTRY_DSN: string
}
