import React, { Children, FunctionComponent, useState } from 'react'
import { Dimensions, FlatList, View, ViewStyle } from 'react-native'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode'

import { colors, layout } from '../../styles'

interface Props {
  style?: ViewStyle
}

export const Carousel: FunctionComponent<Props> = ({ children, style }) => {
  const [active, setActive] = useState(0)

  const data = Children.toArray(children)

  const { width } = Dimensions.get('window')

  const styles = useDynamicStyleSheet(stylesheet)

  return (
    <View style={style}>
      <FlatList
        data={data}
        horizontal
        initialScrollIndex={active}
        onMomentumScrollEnd={(event) =>
          setActive(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        pagingEnabled
        renderItem={({ item }) => (
          <View
            style={{
              marginHorizontal: layout.margin,
              width: width - layout.margin * 2
            }}>
            {item}
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.main}
      />
      <View style={styles.dots}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.dot, index === active && styles.active]}
          />
        ))}
      </View>
    </View>
  )
}

const stylesheet = new DynamicStyleSheet({
  active: {
    opacity: 1
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: layout.padding * 0.75,
    height: layout.padding * 0.75,
    marginHorizontal: layout.padding / 2,
    opacity: 0.25,
    width: layout.padding * 0.75
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: layout.margin
  },
  main: {
    flexGrow: 0
  }
})
