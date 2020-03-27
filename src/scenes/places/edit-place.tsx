import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput
} from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import {
  img_dark_google_maps,
  img_dark_save,
  img_light_google_maps,
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

  const phoneRef = createRef<TextInput>()

  const styles = useDynamicStyleSheet(stylesheet)
  const img_save = useDynamicValue(img_dark_save, img_light_save)
  const img_google_maps = useDynamicValue(
    img_light_google_maps,
    img_dark_google_maps
  )
  const foreground = useDynamicValue(colors.white, colors.black)

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
        <Map
          location={coordinates}
          onChange={(location) => {
            setCoordinates(location)
            setGooglePlaceId(undefined)
          }}
          style={styles.map}
        />
        <Touchable onPress={() => setUseGoogle(true)} style={styles.button}>
          <Image source={img_google_maps} style={styles.icon} />
          <Text
            style={[
              styles.label,
              {
                color: foreground
              }
            ]}>
            Find on Google Places
          </Text>
        </Touchable>
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
    </>
  )
}

const stylesheet = new DynamicStyleSheet({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: layout.radius,
    flexDirection: 'row',
    padding: layout.margin
  },
  error: {
    marginBottom: layout.margin
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  label: {
    ...typography.regular,
    color: colors.black,
    flex: 1,
    marginLeft: layout.margin
  },
  main: {
    padding: layout.margin
  },
  map: {
    marginVertical: layout.margin
  },
  spinner: {
    margin: layout.margin
  }
})
