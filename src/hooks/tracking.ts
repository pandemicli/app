import { useEffect, useState } from 'react'

import { tracking } from '../lib'

export const useTracking = () => {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tracking.check().then((enabled) => {
      setEnabled(enabled)
      setLoading(false)
    })
  }, [])

  const start = async () => {
    setLoading(true)

    const enabled = await tracking.start()

    setEnabled(enabled)
    setLoading(false)
  }

  const stop = async () => {
    setLoading(true)

    const enabled = await tracking.stop()

    setEnabled(enabled)
    setLoading(false)
  }

  return {
    enabled,
    loading,
    start,
    stop
  }
}
