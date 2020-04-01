import {
  NavigationContainerRef,
  NavigationState,
  PartialState
} from '@react-navigation/native'
import { startCase } from 'lodash'
import { createRef } from 'react'

import { analytics } from './analytics'

class Navigation {
  ref = createRef<NavigationContainerRef>()

  current?: string

  onStateChange(state: NavigationState | undefined) {
    if (state) {
      const next = this.getCurrent(state)

      if (next) {
        if (next !== this.current) {
          analytics.screen(next)
        }

        this.current = next
      }
    }
  }

  private getCurrent(
    state: NavigationState | PartialState<NavigationState>
  ): string | undefined {
    if (state.index !== undefined) {
      const route = state.routes[state.index]

      if (route.state) {
        return this.getCurrent(route.state)
      }

      return startCase(route.name)
    }
  }
}

export const nav = new Navigation()
