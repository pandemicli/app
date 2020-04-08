import { useMutation } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { EThree } from '@virgilsecurity/e3kit-native'
import { useState } from 'react'

import { SIGN_IN, SIGN_UP, VERIFY } from '../graphql/documents'
import {
  MutationSignInPayload,
  MutationSignUpPayload,
  MutationVerifyPayload
} from '../graphql/payload'
import {
  MutationSignInArgs,
  MutationSignUpArgs,
  MutationVerifyArgs
} from '../graphql/types'
import { analytics } from '../lib'
import { useAuth } from '../store'

export const useOnboarding = () => {
  const { navigate } = useNavigation()

  const [, actions] = useAuth()

  const [verifying, setVerifying] = useState(false)

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

  return {
    errors: {
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
