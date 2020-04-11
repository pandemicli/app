import React, { FunctionComponent, useEffect, useState } from 'react'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { mitter } from '../../lib'
import { colors } from '../../styles'
import { Spinner } from './spinner'

export const Loading: FunctionComponent = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    mitter.onDialog((visible: boolean) => setVisible(visible))
  }, [])

  const styles = useDynamicStyleSheet(stylesheet)

  if (!visible) {
    return null
  }

  return <Spinner style={styles.main} />
}

const stylesheet = new DynamicStyleSheet({
  main: {
    backgroundColor: colors.modal,
    height: '100%',
    position: 'absolute',
    width: '100%'
  }
})
