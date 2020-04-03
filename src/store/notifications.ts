import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { i18n } from '../i18n'
import { push, storage } from '../lib'

interface State {
  enabled: boolean
  loading: boolean
}
type StoreApi = StoreActionApi<State>

const actions = {
  disable: () => async ({ setState }: StoreApi) => {
    setState({
      loading: true
    })

    push.disableDailyReminder()

    await storage.put('@reminderEnabled', false)

    setState({
      enabled: false,
      loading: false
    })
  },
  enable: () => async ({ setState }: StoreApi) => {
    setState({
      loading: true
    })

    push.enableDailyReminder(
      i18n.t('lib__push__daily_reminder__title'),
      i18n.t('lib__push__daily_reminder__message')
    )

    await storage.put('@reminderEnabled', true)

    setState({
      enabled: true,
      loading: false
    })
  },
  init: () => async ({ setState }: StoreApi) => {
    setState({
      loading: true
    })

    const enabled = await storage.get<boolean>('@reminderEnabled')

    setState({
      enabled: enabled ?? false,
      loading: false
    })
  }
}

type Actions = typeof actions

const initialState: State = {
  enabled: false,
  loading: true
}

const Store = createStore<State, Actions>({
  actions,
  initialState,
  name: 'notifications'
})

export const useNotifications = createHook(Store)
