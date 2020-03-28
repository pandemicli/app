import 'moment/locale/ar'
import 'moment/locale/ur'

import moment from 'moment'
import { AppRegistry } from 'react-native'

import { name } from './app.json'
import { Pandemic } from './src'
import { i18n } from './src/i18n'

moment.locale(i18n.language)

AppRegistry.registerComponent(name, () => Pandemic)
