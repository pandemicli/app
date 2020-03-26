import React, { FunctionComponent } from 'react'
import { SectionListData, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Contact, Place } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Button } from '../common'

interface Props {
  section: SectionListData<Contact | Place>

  onAddContact: () => void
  onAddPlace: () => void
}

export const FeedFooter: FunctionComponent<Props> = ({
  onAddContact,
  onAddPlace,
  section
}) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return section.data.length === 0 ? (
    section.title === 'Contacts' ? (
      <View style={styles.empty}>
        <Text style={styles.message}>
          You haven't favorited any contacts right now.
        </Text>
        <Button label="Add favorite contacts" onPress={onAddContact} small />
      </View>
    ) : (
      <View style={styles.empty}>
        <Text style={styles.message}>
          You haven't favorited any places right now.
        </Text>
        <Button label="Add favorite places" onPress={onAddPlace} small />
      </View>
    )
  ) : null
}

const stylesheet = new DynamicStyleSheet({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: layout.margin * 2
  },
  message: {
    ...typography.small,
    color: colors.foreground,
    marginBottom: layout.margin
  }
})
