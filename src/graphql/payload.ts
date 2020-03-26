import { AuthResult, Contact, Place, User } from './types'

// queries

export type QueryProfilePayload = {
  profile: User
}

export type QueryTodayFeedPayload = {
  todayFeed: {
    contacts: Contact[]
    places: Place[]
  }
}

export type QueryContactsPayload = {
  contacts: Contact[]
}

export type QueryPlacesPayload = {
  places: Place[]
}

// mutations

export type MutationToggleInteractionPayload = {
  toggleInteraction: boolean
}

export type MutationToggleCheckInPayload = {
  toggleCheckIn: boolean
}

export type MutationSyncContactsPayload = {
  syncContacts: Contact[]
}

export type MutationRemoveContactPayload = {
  removeContact: boolean
}

export type MutationToggleFavoriteContactPayload = {
  toggleFavoriteContact: boolean
}

export type MutationRemovePlacePayload = {
  removePlace: boolean
}

export type MutationToggleFavoritePlacePayload = {
  toggleFavoritePlace: boolean
}

export type MutationSignInPayload = {
  signIn: boolean
}

export type MutationSignUpPayload = {
  signUp: boolean
}

export type MutationVerifyPayload = {
  verify: AuthResult
}
