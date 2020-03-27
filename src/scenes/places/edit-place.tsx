import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'
import MapView, { Marker } from 'react-native-maps'

import {
  img_dark_google_maps,
  img_dark_marker,
  img_dark_save,
  img_light_google_maps,
  img_light_marker,
  img_light_save
} from '../../assets'
import {
  Header,
  HeaderButton,
  LocationPicker,
  Map,
  Message,
  TextBox,
  Touchable
} from '../../components/common'
import { LocationPoint } from '../../graphql/types'
import { usePlaces } from '../../hooks'
import { geo } from '../../lib'
import { PlacesParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<PlacesParamList, 'EditPlace'>
  route: RouteProp<PlacesParamList, 'EditPlace'>
}

export const EditPlace: FunctionComponent<Props> = ({
  navigation: { replace, setOptions },
  route: {
    params: { place }
  }
}) => {
  const { errors, update, updating } = usePlaces()

  const [location, setLocation] = useState<LocationPoint>()

  const [name, setName] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState<string>()
  const [coordinates, setCoordinates] = useState<LocationPoint>()

  const [useGoogle, setUseGoogle] = useState(false)
  const [useMap, setUseMap] = useState(false)

  const phoneRef = createRef<TextInput>()

  const styles = useDynamicStyleSheet(stylesheet)
  const img_save = useDynamicValue(img_dark_save, img_light_save)
  const img_marker = useDynamicValue(img_dark_marker, img_light_marker)
  const img_google_maps = useDynamicValue(
    img_dark_google_maps,
    img_light_google_maps
  )

  useEffect(() => {
    const { googlePlaceId, location, name } = place

    setName(name)

    if (googlePlaceId) {
      setGooglePlaceId(googlePlaceId)
    }

    if (location) {
      setCoordinates(location)
    }
  }, [place])

  useEffect(() => {
    geo.get().then((location) => {
      setLocation(location)
    })
  }, [])

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            updating ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.spinner}
              />
            ) : (
              <HeaderButton
                icon={img_save}
                onPress={() => {
                  if (name) {
                    update(place.id, {
                      googlePlaceId,
                      location: coordinates,
                      name
                    })
                  }
                }}
              />
            )
          }
        />
      )
    })
  }, [
    googlePlaceId,
    coordinates,
    name,
    replace,
    img_save,
    setOptions,
    styles.spinner,
    updating,
    update,
    place.id
  ])

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.main}
        keyboardShouldPersistTaps="always">
        {errors.updating && (
          <Message
            message={errors.updating.message}
            style={styles.error}
            type="error"
          />
        )}
        <TextBox
          autoCorrect={false}
          onChangeText={(name) => setName(name)}
          onSubmitEditing={() => phoneRef.current?.focus()}
          placeholder="Name"
          returnKeyType="next"
          value={name}
        />
        {coordinates && (
          <MapView
            pitchEnabled={false}
            provider="google"
            region={{
              latitude: coordinates.latitude,
              latitudeDelta: 0.06,
              longitude: coordinates.longitude,
              longitudeDelta: 0.05
            }}
            rotateEnabled={false}
            scrollEnabled={false}
            style={styles.map}
            zoomEnabled={false}>
            <Marker coordinate={coordinates} />
          </MapView>
        )}
        <View style={styles.buttons}>
          <Touchable
            onPress={() => setUseMap(true)}
            style={[styles.button, styles.buttonMap]}>
            <Image source={img_marker} style={styles.icon} />
            <Text style={styles.label}>Pick location from a map</Text>
          </Touchable>
          <Touchable
            onPress={() => setUseGoogle(true)}
            style={[styles.button, styles.buttonGoogle]}>
            <Image source={img_google_maps} style={styles.icon} />
            <Text style={styles.label}>Find on Google Places</Text>
          </Touchable>
        </View>
      </ScrollView>
      <LocationPicker
        location={location}
        onChange={({ id, latitude, longitude }) => {
          setGooglePlaceId(id)
          setCoordinates({
            latitude,
            longitude
          })
        }}
        onClose={() => setUseGoogle(false)}
        selected={googlePlaceId}
        visible={useGoogle}
      />
      <Map
        location={location}
        onChange={(location) => setCoordinates(location)}
        onClose={() => setUseMap(false)}
        visible={useMap}
      />
    </>
  )
}

const { height } = Dimensions.get('window')

const stylesheet = new DynamicStyleSheet({
  button: {
    alignItems: 'center',
    borderRadius: layout.radius,
    flexDirection: 'row',
    padding: layout.margin
  },
  buttonGoogle: {
    backgroundColor: colors.primaryDark,
    flex: 1,
    marginLeft: layout.margin
  },
  buttonMap: {
    backgroundColor: colors.primary,
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    marginTop: layout.margin
  },
  error: {
    marginBottom: layout.margin
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  label: {
    ...typography.footnote,
    color: colors.foreground,
    flex: 1,
    marginLeft: layout.margin
  },
  main: {
    padding: layout.margin
  },
  map: {
    borderRadius: layout.radius,
    height: height / 3,
    marginTop: layout.margin
  },
  spinner: {
    margin: layout.margin
  }
})
