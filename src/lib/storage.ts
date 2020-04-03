import AsyncStorage from '@react-native-community/async-storage'

type Keys = '@token' | '@userId' | '@reminderEnabled'

class Storage {
  async get<T>(key: Keys): Promise<T | null> {
    const value = await AsyncStorage.getItem(key)

    if (value) {
      return JSON.parse(value)
    }

    return null
  }

  async put(key: string, value: object | string | boolean): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear()
  }
}

export const storage = new Storage()
