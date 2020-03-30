import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { createRef, FunctionComponent, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput } from 'react-native'
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
  Image,
  LocationPicker,
  Map,
  Message,
  TextBox,
  Touchable
} from '../../components/common'
import { usePlaceActions } from '../../hooks'
import { i18n } from '../../i18n'
import { geo } from '../../lib'
import { PlacesParamList } from '../../navigators'
import { colors, layout, typography } from '../../styles'
import { LocationPoint } from '../../types'

interface Props {
  navigation: StackNavigationProp<PlacesParamList, 'EditPlace'>
  route: RouteProp<PlacesParamList, 'EditPlace'>
}

export const EditPlace: FunctionComponent<Props> = ({
  navigation: { setOptions },
  route: {
    params: { place }
  }
}) => {
  const { errors, update, updating } = usePlaceActions()

  const [location, setLocation] = useState<LocationPoint>()

  const [name, setName] = useState('')
  const [googlePlaceId, setGooglePlaceId] = useState<string>()
  const [latitude, setLatitude] = useState<string>()
  const [longitude, setLongitude] = useState<string>()

  const [useGoogle, setUseGoogle] = useState(false)

  const phoneRef = createRef<TextInput>()

  const styles = useDynamicStyleSheet(stylesheet)
  const color_foreground = useDynamicValue(colors.white, colors.black)
  const img_save = useDynamicValue(img_dark_save, img_light_save)
  const img_google_maps = useDynamicValue(
    img_light_google_maps,
    img_dark_google_maps
  )

  useEffect(() => {
    const { googlePlaceId, latitude, longitude, name } = place

    setName(name)

    if (googlePlaceId) {
      setGooglePlaceId(googlePlaceId)
    }

    if (latitude && longitude) {
      setLatitude(latitude)
      setLongitude(longitude)
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
                      latitude,
                      longitude,
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
    img_save,
    latitude,
    longitude,
    name,
    place.id,
    setOptions,
    styles.spinner,
    update,
    updating
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
          placeholder={i18n.t('label__name')}
          returnKeyType="next"
          value={name}
        />
        <Map
          latitude={latitude}
          location={location}
          longitude={longitude}
          onChange={(latitude, longitude) => {
            setLatitude(latitude)
            setLongitude(longitude)

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
                color: color_foreground
              }
            ]}>
            {i18n.t('places__find_on_google_places')}
          </Text>
        </Touchable>
      </ScrollView>
      <LocationPicker
        location={location}
        onChange={({ id, latitude, longitude, name }) => {
          setGooglePlaceId(id)
          setLatitude(String(latitude))
          setLongitude(String(longitude))
          setName(name)
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
    marginStart: layout.margin
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
