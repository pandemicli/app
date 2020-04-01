import { AuthResult, Contact, GooglePlace, Place, Symptom, User } from './types'

// queries

export type QueryTodayFeedPayload = {
  todayFeed: {
    contacts: Contact[]
    places: Place[]
    symptoms: Symptom[]
  }
}

export type QueryContactsPayload = {
  contacts: Contact[]
}

export type QueryPlacesPayload = {
  places: Place[]
}

export type QueryProfilePayload = {
  profile: User
}

export type QuerySearchPlacesPayload = {
  searchPlaces: GooglePlace[]
}

// mutations

export type MutationSignInPayload = {
  signIn: boolean
}

export type MutationSignUpPayload = {
  signUp: boolean
}

export type MutationVerifyPayload = {
  verify: AuthResult
}

export type MutationCreateContactPayload = {
  createContact: Contact
}

export type MutationUpdateContactPayload = {
  updateContact: Contact
}

export type MutationRemoveContactPayload = {
  removeContact: boolean
}

export type MutationToggleInteractionPayload = {
  toggleInteraction: boolean
}

export type MutationToggleFavoriteContactPayload = {
  toggleFavoriteContact: boolean
}

export type MutationSyncContactsPayload = {
  syncContacts: Contact[]
}

export type MutationAddContactPayload = {
  addContact: Contact
}

export type MutationCreatePlacePayload = {
  createPlace: Place
}

export type MutationUpdatePlacePayload = {
  updatePlace: Place
}

export type MutationRemovePlacePayload = {
  removePlace: boolean
}

export type MutationToggleFavoritePlacePayload = {
  toggleFavoritePlace: boolean
}

export type MutationToggleCheckInPayload = {
  toggleCheckIn: boolean
}

export type MutationToggleSymptomPayload = {
  toggleSymptom: boolean
}
