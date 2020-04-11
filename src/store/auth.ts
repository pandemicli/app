import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { client } from '../graphql'
import {
  analytics,
  crypto,
  mitter,
  notifications,
  storage,
  tracking
} from '../lib'

interface State {
  loading: boolean
  unloading: boolean
  userId: string | null
}
type StoreApi = StoreActionApi<State>

const actions = {
  init: () => async ({ dispatch, setState }: StoreApi) => {
    await tracking.init()
    await notifications.init()

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

    mitter.onLogout(() => dispatch(actions.signOut()))
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

    const { userId } = getState()

    if (userId) {
      await notifications.unsubscribe(userId)
    }

    await crypto.reset()

    await tracking.stop()

    await storage.remove('@token')
    await storage.remove('@userId')

    await client.clearStore()
    await client.cache.reset()

    await analytics.reset()

    setState({
      unloading: false,
      userId: null
    })
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
