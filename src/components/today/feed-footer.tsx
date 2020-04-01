import React, { FunctionComponent } from 'react'
import { SectionListData, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Contact, Place, Symptom } from '../../graphql/types'
import { i18n } from '../../i18n'
import { colors, layout, typography } from '../../styles'
import { Button } from '../common'

interface Props {
  section: SectionListData<Contact | Place | Symptom>

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
    section.key === 'Contacts' ? (
      <View style={styles.empty}>
        <Text style={styles.message}>
          {i18n.t('today__footer__empty_contacts__message')}
        </Text>
        <Button
          label={i18n.t('today__footer__empty_contacts__label')}
          onPress={onAddContact}
          small
        />
      </View>
    ) : (
      <View style={styles.empty}>
        <Text style={styles.message}>
          {i18n.t('today__footer__empty_places__message')}
        </Text>
        <Button
          label={i18n.t('today__footer__empty_places__label')}
          onPress={onAddPlace}
          small
        />
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
