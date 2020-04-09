import { useMutation } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { EThree } from '@virgilsecurity/e3kit-native'
import { useState } from 'react'

import { CHANGE_PASSWORD, SIGN_IN, SIGN_UP, VERIFY } from '../graphql/documents'
import {
  MutationChangePasswordPayload,
  MutationSignInPayload,
  MutationSignUpPayload,
  MutationVerifyPayload
} from '../graphql/payload'
import {
  MutationChangePasswordArgs,
  MutationSignInArgs,
  MutationSignUpArgs,
  MutationVerifyArgs
} from '../graphql/types'
import { analytics, crypto } from '../lib'
import { useAuth } from '../store'

export const useOnboarding = () => {
  const { navigate } = useNavigation()

  const [, actions] = useAuth()

  const [verifying, setVerifying] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const [register, registerMutation] = useMutation<
    MutationSignUpPayload,
    MutationSignUpArgs
  >(SIGN_UP)

  const [login, loginMutation] = useMutation<
    MutationSignInPayload,
    MutationSignInArgs
  >(SIGN_IN)

  const [mfa, mfaMutation] = useMutation<
    MutationVerifyPayload,
    MutationVerifyArgs
  >(VERIFY)

  const [change, changeMutation] = useMutation<
    MutationChangePasswordPayload,
    MutationChangePasswordArgs
  >(CHANGE_PASSWORD)

  const signUp = (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => {
    const { backupPassword, loginPassword } = EThree.derivePasswords(password)

    register({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        navigate('Verify', {
          backupPassword: backupPassword.toString(),
          newUser: true
        })

        analytics.track('User Signed Up')
      },
      variables: {
        email,
        name,
        password: loginPassword.toString(),
        phone
      }
    })
  }

  const signIn = (email: string, password: string) => {
    const { backupPassword, loginPassword } = EThree.derivePasswords(password)

    login({
      update(proxy, response) {
        if (!response.data) {
          return
        }

        navigate('Verify', {
          backupPassword: backupPassword.toString(),
          newUser: false
        })

        analytics.track('User Signed In')
      },
      variables: {
        email,
        password: loginPassword.toString()
      }
    })
  }

  const verify = (code: string, newUser: boolean, password: string) => {
    setVerifying(true)

    mfa({
      async update(proxy, response) {
        if (!response.data) {
          setVerifying(false)

          return
        }

        const {
          verify: {
            token,
            user: { id }
          }
        } = response.data

        await actions.signIn(id, token, newUser, password)

        setVerifying(false)

        analytics.track('User Verified Code')
      },
      variables: {
        code
      }
    })
  }

  const changePassword = (
    currentPassword: string,
    newPassword: string,
    callback: () => void
  ) => {
    setChangingPassword(true)

    const old = EThree.derivePasswords(currentPassword)
    const next = EThree.derivePasswords(newPassword)

    change({
      async update(proxy, response) {
        if (!response.data) {
          setChangingPassword(false)

          return
        }

        await crypto.changePassword(
          old.backupPassword.toString(),
          next.backupPassword.toString()
        )

        setChangingPassword(false)

        callback()
      },
      variables: {
        currentPassword: old.loginPassword.toString(),
        newPassword: next.loginPassword.toString()
      }
    })
  }

  return {
    changePassword,
    changingPassword: changeMutation.loading || changingPassword,
    errors: {
      changePassword: changeMutation.error,
      signIn: loginMutation.error,
      signUp: registerMutation.error,
      verify: mfaMutation.error
    },
    signIn,
    signUp,
    signingIn: loginMutation.loading,
    signingUp: registerMutation.loading,
    verify,
    verifying: mfaMutation.loading || verifying
  }
}
