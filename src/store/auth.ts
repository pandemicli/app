import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { client } from '../graphql'
import { analytics, crypto, notifications, storage, tracking } from '../lib'

interface State {
  loading: boolean
  unloading: boolean
  userId: string | null
}
type StoreApi = StoreActionApi<State>

const actions = {
  init: () => async ({ setState }: StoreApi) => {
    const token = await storage.get<string>('@token')
    const userId = await storage.get<string>('@userId')

    if (token && userId) {
      await analytics.identify(userId)
      await crypto.init(token)
      await notifications.subscribe(userId)

      setState({
        userId
      })
    }

    setState({
      loading: false
    })
  },
  signIn: (
    userId: string,
    token: string,
    newUser: boolean,
    password: string
  ) => async ({ setState }: StoreApi) => {
    await storage.put('@token', token)
    await storage.put('@userId', userId)

    await crypto.init(token)
    await notifications.subscribe(userId)

    if (newUser) {
      await crypto.register()
      await crypto.backupKey(password)
    }

    await crypto.fetchKey(password)

    setState({
      userId
    })
  },
  signOut: () => async ({ getState, setState }: StoreApi) => {
    setState({
      unloading: true
    })

    try {
      const { userId } = getState()

      if (userId) {
        await notifications.unsubscribe(userId)
      }

      await crypto.reset()

      await tracking.stop()

      await client.clearStore()
      await client.cache.reset()

      await analytics.reset()
    } finally {
      await storage.remove('@token')
      await storage.remove('@userId')

      setState({
        unloading: false,
        userId: null
      })
    }
  }
}

type Actions = typeof actions

const initialState: State = {
  loading: true,
  unloading: false,
  userId: null
}

const Store = createStore<State, Actions>({
  actions,
  initialState,
  name: 'auth'
})

export const useAuth = createHook(Store)
