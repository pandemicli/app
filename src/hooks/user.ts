import { useMutation, useQuery } from '@apollo/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { EThree } from '@virgilsecurity/e3kit-native'
import { useState } from 'react'

import {
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  PROFILE,
  SIGN_IN,
  SIGN_UP,
  VERIFY
} from '../graphql/documents'
import {
  MutationChangePasswordPayload,
  MutationDeleteAccountPayload,
  MutationSignInPayload,
  MutationSignUpPayload,
  MutationVerifyPayload,
  QueryProfilePayload
} from '../graphql/payload'
import {
  MutationChangePasswordArgs,
  MutationDeleteAccountArgs,
  MutationSignInArgs,
  MutationSignUpArgs,
  MutationVerifyArgs
} from '../graphql/types'
import { i18n } from '../i18n'
import { analytics, crypto, dialog, mitter } from '../lib'
import { useAuth } from '../store'

export const useProfile = () => {
  const { data, loading, refetch } = useQuery<QueryProfilePayload>(PROFILE)

  return {
    data,
    loading,
    refetch
  }
}

export const useUser = () => {
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

  const [remove, removeMutation] = useMutation<
    MutationDeleteAccountPayload,
    MutationDeleteAccountArgs
  >(DELETE_ACCOUNT, {
    onError() {
      mitter.emit('loading', false)

      dialog.error(i18n.t('dialog__confirm__delete_account__error'))
    }
  })

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

  const deleteAccount = async () => {
    const password = await dialog.prompt({
      inputType: 'password',
      labelNegative: i18n.t('dialog__label__no'),
      labelPositive: i18n.t('dialog__label__yes'),
      message: i18n.t('dialog__confirm__delete_account__message'),
      placeholder: i18n.t('dialog__confirm__delete_account__placeholder'),
      positive: false,
      title: i18n.t('dialog__confirm__delete_account__title')
    })

    if (password) {
      mitter.emit('loading', true)

      const { loginPassword } = EThree.derivePasswords(password)

      remove({
        async update(proxy, response) {
          if (!response.data) {
            return
          }

          await crypto.remove()
          await actions.signOut()

          mitter.emit('loading', false)
        },
        variables: {
          password: loginPassword.toString()
        }
      })
    }
  }

  return {
    changePassword,
    changingPassword: changeMutation.loading || changingPassword,
    deleteAccount,
    deletingAccount: removeMutation.loading,
    errors: {
      changePassword: changeMutation.error,
      deleteAccount: removeMutation.error,
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
