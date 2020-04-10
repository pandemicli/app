import React, { FunctionComponent } from 'react'
import { Dimensions, View, ViewStyle } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import MapView, { Region } from 'react-native-maps'

import { img_marker } from '../../assets'
import { layout } from '../../styles'
import { LocationPoint } from '../../types'
import { Image } from './image'

interface Props {
  latitude?: string | null
  location?: LocationPoint
  longitude?: string | null
  style?: ViewStyle

  onChange: (latitude: string, longitude: string) => void
}

export const Map: FunctionComponent<Props> = ({
  latitude,
  location,
  longitude,
  onChange,
  style
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  const region: Region = {
    latitude: 25.1974428,
    latitudeDelta: 0.05,
    longitude: 55.2772719,
    longitudeDelta: 0.05
  }

  if (typeof latitude === 'string' && typeof longitude === 'string') {
    region.latitude = Number(latitude)
    region.longitude = Number(longitude)
  } else if (location) {
    const { latitude, longitude } = location

    region.latitude = latitude
    region.longitude = longitude
  }

  return (
    <>
      <MapView
        initialRegion={region}
        onRegionChangeComplete={({ latitude, longitude }) =>
          onChange(String(latitude), String(longitude))
        }
        style={[styles.map, style]}
      />
      <View pointerEvents="none" style={styles.marker}>
        <Image source={img_marker} style={styles.icon} />
      </View>
    </>
  )
}

const { height } = Dimensions.get('window')

const stylesheet = new DynamicStyleSheet({
  button: {
    borderTopEndRadius: 0,
    borderTopStartRadius: 0
  },
  icon: {
    height: 30,
    width: 30
  },
  map: {
    borderRadius: layout.radius,
    height: height / 3
  },
  marker: {
    left: '50%',
    marginStart: 1,
    marginTop: -15,
    position: 'absolute',
    top: '50%'
  }
})
