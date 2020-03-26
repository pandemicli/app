import React, { forwardRef, useState } from 'react'
import { Image, Text, TextInput, View, ViewStyle } from 'react-native'
import {
  DynamicStyleSheet,
  useDynamicStyleSheet,
  useDynamicValue
} from 'react-native-dark-mode'

import { img_dark_expand, img_light_expand } from '../../assets'
import { countries } from '../../data'
import { colors, layout, typography } from '../../styles'
import { Picker } from './picker'
import { TextBox } from './text-box'
import { Touchable } from './touchable'

interface Props {
  selected?: string
  style?: ViewStyle

  onChange: (phone: string) => void
}

export const PhoneNumber = forwardRef<TextInput, Props>(
  ({ onChange, selected, style }, ref) => {
    const [id, setId] = useState(selected || 'AE')
    const [phone, setPhone] = useState('')

    const [visible, setVisible] = useState(false)

    const styles = useDynamicStyleSheet(stylesheet)
    const expand = useDynamicValue(img_dark_expand, img_light_expand)

    const country = countries.find((country) => country.id === id)

    return (
      <>
        <View style={[styles.main, style]}>
          <Touchable onPress={() => setVisible(true)} style={styles.code}>
            <Text style={styles.codeLabel}>{country?.code}</Text>
            <Image source={expand} style={styles.icon} />
          </Touchable>
          <TextBox
            keyboardType="number-pad"
            onChangeText={(phone) => {
              setPhone(phone)

              onChange(`+${country?.code}${phone}`)
            }}
            placeholder="Phone"
            ref={ref}
            returnKeyType="done"
            style={styles.phone}
            value={phone}
          />
        </View>
        <Picker
          data={countries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ code, id, name }) => ({
              label: `${name} (${code})`,
              value: id
            }))}
          keyExtractor={(item) => item.label}
          onChange={({ value }) => setId(value)}
          onClose={() => setVisible(false)}
          title="Select country"
          visible={visible}
        />
      </>
    )
  }
)

const stylesheet = new DynamicStyleSheet({
  code: {
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    borderBottomLeftRadius: layout.radius,
    borderTopLeftRadius: layout.radius,
    flexDirection: 'row',
    height: layout.textBox,
    justifyContent: 'center',
    paddingLeft: layout.margin * (3 / 4)
  },
  codeLabel: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  },
  icon: {
    height: layout.icon,
    marginLeft: layout.padding / 2,
    width: layout.icon
  },
  label: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  },
  main: {
    flexDirection: 'row'
  },
  phone: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    flex: 1
  }
})
