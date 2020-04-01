import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { client } from '../graphql'
import { analytics, crypto, storage } from '../lib'

interface State {
  loading: boolean
  userId: string | null
}
type StoreApi = StoreActionApi<State>

const actions = {
  init: () => async ({ setState }: StoreApi) => {
    const token = await storage.get('@token')
    const userId = await storage.get('@userId')

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

    setState({
      userId
    })
  },
  signOut: () => async ({ setState }: StoreApi) => {
    await storage.remove('@token')
    await storage.remove('@userId')

    await client.clearStore()
    await client.cache.reset()

    await analytics.reset()

    setState({
      userId: null
    })
  }
}

type Actions = typeof actions

const initialState: State = {
  loading: true,
  userId: null
}

const Store = createStore<State, Actions>({
  actions,
  initialState,
  name: 'auth'
})

export const useAuth = createHook(Store)
