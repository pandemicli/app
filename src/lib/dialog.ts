import { Alert } from 'react-native'

class Dialog {
  error(message: string) {
    Alert.alert('Error', message)
  }

  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) =>
      Alert.alert('Are you sure?', message, [
        {
          onPress: () => resolve(false),
          style: 'cancel',
          text: 'No'
        },
        {
          onPress: () => resolve(true),
          style: 'destructive',
          text: 'Yes'
        }
      ])
    )
  }
}

export const dialog = new Dialog()
