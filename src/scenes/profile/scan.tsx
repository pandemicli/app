import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Spinner } from '../../components/common'
import { useContacts } from '../../hooks'
import { ProfileParamList } from '../../navigators'
import { colors } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ProfileParamList, 'Scan'>
  route: RouteProp<ProfileParamList, 'Scan'>
}

export const Scan: FunctionComponent<Props> = () => {
  const { add, adding } = useContacts()

  const [code, setCode] = useState<string>()
  const [added, setAdded] = useState(new Map())

  useEffect(() => {
    if (code) {
      if (added.get(code)) {
        return
      }

      console.log('code', code)

      add(code)

      const next = new Map(added)

      next.set(code, true)

      setAdded(next)
    }
  }, [add, added, code])

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.main}>
      <RNCamera
        captureAudio={false}
        onBarCodeRead={({ data }) => setCode(data)}
        style={styles.main}
      />
      {adding && <Spinner style={styles.spinner} />}
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  main: {
    flex: 1
  },
  spinner: {
    backgroundColor: colors.modal,
    height: '100%',
    position: 'absolute',
    width: '100%'
  }
})
