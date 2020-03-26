import React, { FunctionComponent } from 'react'
import {
  Platform,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native'

export const Touchable: FunctionComponent<
  TouchableOpacityProps & TouchableNativeFeedbackProps
> = ({ children, onPress, style }) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  )
}
