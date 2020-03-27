import React, { FunctionComponent, useState } from 'react'
import { Dimensions, Image } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'
import MapView, { Region } from 'react-native-maps'

import { img_marker } from '../../assets'
import { LocationPoint } from '../../graphql/types'
import { Button } from './button'
import { Modal } from './modal'

interface Props {
  location?: LocationPoint
  visible: boolean

  onChange: (location: LocationPoint) => void
  onClose: () => void
}

export const Map: FunctionComponent<Props> = ({
  location,
  onChange,
  onClose,
  visible
}) => {
  const [coordinates, setCoordinates] = useState<LocationPoint>()

  const styles = useDynamicStyleSheet(stylesheet)

  const region: Region = {
    latitude: 25.1974428,
    latitudeDelta: 0.05,
    longitude: 55.2772719,
    longitudeDelta: 0.05
  }

  if (location) {
    const { latitude, longitude } = location

    region.latitude = latitude
    region.longitude = longitude
  }

  return (
    <Modal onClose={onClose} title="Pick location" visible={visible}>
      <MapView
        initialRegion={region}
        onRegionChangeComplete={({ latitude, longitude }) =>
          setCoordinates({
            latitude,
            longitude
          })
        }
        provider="google"
        style={styles.map}
      />
      <Image source={img_marker} style={styles.marker} />
      <Button
        label="Done"
        onPress={() => {
          if (coordinates) {
            onChange(coordinates)
          }

          onClose()
        }}
        style={styles.button}
      />
    </Modal>
  )
}

const { height } = Dimensions.get('window')

const stylesheet = new DynamicStyleSheet({
  button: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  map: {
    height: height / 2
  },
  marker: {
    height: 30,
    left: '50%',
    marginLeft: -15,
    position: 'absolute',
    top: '50%',
    width: 30
  }
})
