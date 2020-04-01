declare module '*.png'

declare module 'react-native-dotenv' {
  export const API_URI: string
  export const TRACKING_API_URI: string

  export const CODE_PUSH_KEY_ANDROID: string
  export const CODE_PUSH_KEY_IOS: string

  export const GOOGLE_API_KEY_ANDROID: string
  export const GOOGLE_API_KEY_IOS: string

  export const SEGMENT_KEY: string
  export const SENTRY_DSN: string
}

declare module 'react-native-ec-encryption' {
  type Input = {
    data: string
    label: string
  }

  namespace EC {
    const encrypt: (input: Input) => Promise<string>
    const decrypt: (input: Input) => Promise<string>
  }

  export default EC
}

declare module 'react-native-sha256' {
  export const sha256: (input: string) => Promise<string>
}
