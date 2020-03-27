import gql from 'graphql-tag';

export const ADD_CONTACT = gql`
    mutation addContact($code: String!) {
  addContact(code: $code) {
    id
    favorite
    name
    phone
    createdAt
    interactedToday
  }
}
    `;
export const CREATE_CONTACT = gql`
    mutation createContact($contact: ContactInput!) {
  createContact(contact: $contact) {
    id
    favorite
    name
    phone
    createdAt
    interactedToday
  }
}
    `;
export const CREATE_PLACE = gql`
    mutation createPlace($place: PlaceInput!) {
  createPlace(place: $place) {
    id
    favorite
    googlePlaceId
    location {
      latitude
      longitude
    }
    name
    checkedInToday
    createdAt
  }
}
    `;
export const REMOVE_CONTACT = gql`
    mutation removeContact($id: String!) {
  removeContact(id: $id)
}
    `;
export const REMOVE_PLACE = gql`
    mutation removePlace($id: String!) {
  removePlace(id: $id)
}
    `;
export const SIGN_IN = gql`
    mutation signIn($phone: String!) {
  signIn(phone: $phone)
}
    `;
export const SIGN_UP = gql`
    mutation signUp($email: String!, $name: String!, $phone: String!) {
  signUp(email: $email, phone: $phone, name: $name)
}
    `;
export const SYNC_CONTACTS = gql`
    mutation syncContacts($contacts: [ContactInput!]!) {
  syncContacts(contacts: $contacts) {
    id
  }
}
    `;
export const TOGGLE_CHECK_IN = gql`
    mutation toggleCheckIn($id: String!, $date: String!) {
  toggleCheckIn(id: $id, date: $date)
}
    `;
export const TOGGLE_FAVORITE_CONTACT = gql`
    mutation toggleFavoriteContact($id: String!) {
  toggleFavoriteContact(id: $id)
}
    `;
export const TOGGLE_FAVORITE_PLACE = gql`
    mutation toggleFavoritePlace($id: String!) {
  toggleFavoritePlace(id: $id)
}
    `;
export const TOGGLE_INTERACTION = gql`
    mutation toggleInteraction($id: String!, $date: String!) {
  toggleInteraction(id: $id, date: $date)
}
    `;
export const UPDATE_CONTACT = gql`
    mutation updateContact($id: String!, $contact: ContactInput!) {
  updateContact(id: $id, contact: $contact) {
    id
    favorite
    name
    phone
    createdAt
    interactedToday
  }
}
    `;
export const UPDATE_PLACE = gql`
    mutation updatePlace($id: String!, $place: PlaceInput!) {
  updatePlace(id: $id, place: $place) {
    id
    favorite
    googlePlaceId
    location {
      latitude
      longitude
    }
    name
    checkedInToday
    createdAt
  }
}
    `;
export const VERIFY = gql`
    mutation verify($code: String!) {
  verify(code: $code) {
    token
    user {
      id
    }
  }
}
    `;
export const CONTACTS = gql`
    query contacts($date: String) {
  contacts(date: $date) {
    id
    favorite
    name
    phone
    createdAt
    interactedToday
  }
}
    `;
export const PLACES = gql`
    query places($date: String) {
  places(date: $date) {
    id
    favorite
    googlePlaceId
    location {
      latitude
      longitude
    }
    name
    checkedInToday
    createdAt
  }
}
    `;
export const PROFILE = gql`
    query profile {
  profile {
    id
    code
    name
    email
    phone
    createdAt
  }
}
    `;
export const SEARCH_PLACES = gql`
    query searchPlaces($query: String!, $location: LocationPointInput!) {
  searchPlaces(query: $query, location: $location) {
    id
    name
    latitude
    longitude
  }
}
    `;
export const TODAY_FEED = gql`
    query todayFeed($date: String!) {
  todayFeed(date: $date) {
    contacts {
      id
      name
      interactedToday
    }
    places {
      id
      name
      checkedInToday
    }
  }
}
    `;