import React, { FunctionComponent } from 'react'
import { SectionListData, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Contact, Place } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Touchable } from '../common'

interface Props {
  section: SectionListData<Contact | Place>

  onPress: () => void
}

export const FeedHeader: FunctionComponent<Props> = ({ onPress, section }) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {section.title === 'Contacts'
          ? 'Have you met these people today?'
          : 'Have you been to these places today?'}
      </Text>
      <Touchable onPress={onPress}>
        <Text style={styles.more}>More</Text>
      </Touchable>
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  header: {
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    flexDirection: 'row'
  },
  more: {
    ...typography.small,
    ...typography.bold,
    color: colors.accent,
    margin: layout.margin
  },
  title: {
    ...typography.small,
    ...typography.medium,
    color: colors.foregroundLight,
    flex: 1,
    marginHorizontal: layout.margin
  }
})
