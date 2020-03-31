import 'moment/locale/ar'
import 'moment/locale/ur'

import * as Sentry from '@sentry/react-native'
import moment from 'moment'
import { AppRegistry } from 'react-native'
import { SENTRY_DSN } from 'react-native-dotenv'

import { name } from './app.json'
import { Pandemic } from './src'
import { i18n } from './src/i18n'

moment.locale(i18n.language)

Sentry.init({
  dsn: SENTRY_DSN
})

AppRegistry.registerComponent(name, () => Pandemic)
