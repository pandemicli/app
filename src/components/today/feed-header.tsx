import React, { FunctionComponent } from 'react'
import { SectionListData, Text, View } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { Contact, Place, Symptom } from '../../graphql/types'
import { i18n } from '../../i18n'
import { colors, layout, typography } from '../../styles'
import { Touchable } from '../common'

interface Props {
  section: SectionListData<Contact | Place | Symptom>

  onPress: () => void
}

export const FeedHeader: FunctionComponent<Props> = ({ onPress, section }) => {
  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {section.key === 'Contacts'
          ? i18n.t('today__header__contacts__title')
          : section.key === 'Places'
          ? i18n.t('today__header__places__title')
          : section.key === 'Symptoms'
          ? i18n.t('today__header__symptoms__title')
          : null}
      </Text>
      {section.key !== 'Symptoms' && (
        <Touchable onPress={onPress}>
          <Text style={styles.more}>{i18n.t('label__more')}</Text>
        </Touchable>
      )}
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
    margin: layout.margin
  }
})
