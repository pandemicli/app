import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { client } from '../graphql'
import { analytics, crypto, storage, tracking } from '../lib'

interface State {
  loading: boolean
  unloading: boolean
  userId: string | null
}
type StoreApi = StoreActionApi<State>

const actions = {
  init: () => async ({ setState }: StoreApi) => {
    await tracking.init()

    const token = await storage.get<string>('@token')
    const userId = await storage.get<string>('@userId')

    if (token && userId) {
      await analytics.identify(userId)

      crypto.init(userId)

      setState({
        userId
      })
    }

    setState({
      loading: false
    })
  },
  signIn: (userId: string, token: string) => async ({ setState }: StoreApi) => {
    await storage.put('@token', token)
    await storage.put('@userId', userId)

    crypto.init(userId)

    setState({
      userId
    })
  },
  signOut: () => async ({ setState }: StoreApi) => {
    setState({
      unloading: true
    })

    await tracking.stop()

    await storage.remove('@token')
    await storage.remove('@userId')

    await client.clearStore()
    await client.cache.reset()

    await analytics.reset()

    crypto.reset()

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
