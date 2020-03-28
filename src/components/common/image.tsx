import React, { FunctionComponent } from 'react'
import { StyleSheet } from 'react-native'
import FastImage, { FastImageProps } from 'react-native-fast-image'

import { i18n } from '../../i18n'

interface Props {
  reverse?: boolean
}

export const Image: FunctionComponent<Props & FastImageProps> = ({
  reverse = true,
  style,
  ...props
}) => <FastImage {...props} style={[style, reverse && styles.reverse]} />

const styles = StyleSheet.create({
  reverse: {
    transform: [
      {
        scaleX: i18n.rtl ? -1 : 1
      }
    ]
  }
})
