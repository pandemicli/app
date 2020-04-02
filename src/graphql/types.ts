export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type AuthResult = {
   __typename?: 'AuthResult';
  token: Scalars['String'];
  user: User;
};

export type CheckIn = {
   __typename?: 'CheckIn';
  place: Place;
  user: User;
  checkedInAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Contact = {
   __typename?: 'Contact';
  id: Scalars['ID'];
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  phoneHash?: Maybe<Scalars['String']>;
  favorite: Scalars['Boolean'];
  user: User;
  interactedToday: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type ContactInput = {
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  phoneHash?: Maybe<Scalars['String']>;
  deviceId?: Maybe<Scalars['String']>;
};


export type GooglePlace = {
   __typename?: 'GooglePlace';
  id: Scalars['String'];
  name: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type Interaction = {
   __typename?: 'Interaction';
  contact: Contact;
  user: User;
  interactedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createContact: Contact;
  updateContact: Contact;
  removeContact: Scalars['Boolean'];
  toggleFavoriteContact: Scalars['Boolean'];
  toggleInteraction: Scalars['Boolean'];
  syncContacts: Array<Contact>;
  addContact: User;
  createPlace: Place;
  updatePlace: Place;
  removePlace: Scalars['Boolean'];
  toggleFavoritePlace: Scalars['Boolean'];
  toggleCheckIn: Scalars['Boolean'];
  toggleSymptom: Scalars['Boolean'];
  signIn: Scalars['Boolean'];
  signUp: Scalars['Boolean'];
  verify: AuthResult;
  toggleCovid19Positive: Scalars['Boolean'];
};


export type MutationCreateContactArgs = {
  contact: ContactInput;
};


export type MutationUpdateContactArgs = {
  contact: ContactInput;
  id: Scalars['String'];
};


export type MutationRemoveContactArgs = {
  id: Scalars['String'];
};


export type MutationToggleFavoriteContactArgs = {
  id: Scalars['String'];
};


export type MutationToggleInteractionArgs = {
  date: Scalars['String'];
  id: Scalars['String'];
};


export type MutationSyncContactsArgs = {
  contacts: Array<ContactInput>;
};


export type MutationAddContactArgs = {
  code: Scalars['String'];
};


export type MutationCreatePlaceArgs = {
  place: PlaceInput;
};


export type MutationUpdatePlaceArgs = {
  place: PlaceInput;
  id: Scalars['String'];
};


export type MutationRemovePlaceArgs = {
  id: Scalars['String'];
};


export type MutationToggleFavoritePlaceArgs = {
  id: Scalars['String'];
};


export type MutationToggleCheckInArgs = {
  date: Scalars['String'];
  id: Scalars['String'];
};


export type MutationToggleSymptomArgs = {
  date: Scalars['String'];
  name: SymptomName;
};


export type MutationSignInArgs = {
  phone: Scalars['String'];
};


export type MutationSignUpArgs = {
  phone: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
};


export type MutationVerifyArgs = {
  code: Scalars['String'];
};

export type Place = {
   __typename?: 'Place';
  id: Scalars['ID'];
  name: Scalars['String'];
  favorite: Scalars['Boolean'];
  latitude?: Maybe<Scalars['String']>;
  latitudeHash?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  longitudeHash?: Maybe<Scalars['String']>;
  googlePlaceId?: Maybe<Scalars['String']>;
  googlePlaceIdHash?: Maybe<Scalars['String']>;
  user: User;
  checkedInToday: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type PlaceInput = {
  name: Scalars['String'];
  latitude?: Maybe<Scalars['String']>;
  latitudeHash?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  longitudeHash?: Maybe<Scalars['String']>;
  googlePlaceId?: Maybe<Scalars['String']>;
  googlePlaceIdHash?: Maybe<Scalars['String']>;
};

export type Query = {
   __typename?: 'Query';
  contacts: Array<Contact>;
  places: Array<Place>;
  searchPlaces: Array<GooglePlace>;
  todayFeed: TodayFeed;
  profile: User;
};


export type QueryContactsArgs = {
  date?: Maybe<Scalars['String']>;
};


export type QueryPlacesArgs = {
  date?: Maybe<Scalars['String']>;
};


export type QuerySearchPlacesArgs = {
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
  language?: Maybe<Scalars['String']>;
  query: Scalars['String'];
};


export type QueryTodayFeedArgs = {
  date: Scalars['String'];
};

export type Symptom = {
   __typename?: 'Symptom';
  name: SymptomName;
  experiencedToday: Scalars['Boolean'];
};

export enum SymptomName {
  AchesAndPains = 'aches_and_pains',
  Diarrhea = 'diarrhea',
  DryCough = 'dry_cough',
  Fever = 'fever',
  NasalCongestion = 'nasal_congestion',
  RunnyNose = 'runny_nose',
  SoreThroat = 'sore_throat',
  Tiredness = 'tiredness'
}

export type TodayFeed = {
   __typename?: 'TodayFeed';
  contacts: Array<Contact>;
  places: Array<Place>;
  symptoms: Array<Symptom>;
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  code: Scalars['String'];
  name: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  covid19Positive: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};
