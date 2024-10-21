import useSupabaseAuth from '@/hooks/useSupabaseAuth'
import Avatar from '@/src/components/Avatar'
import { useUserStore } from '@/store/userUserStore'
import {
  NavigationProp,
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'

import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button from '@/src/components/Button'
import { Input } from 'react-native-elements'

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false)
  const { session } = useUserStore()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userName, setUserName] = useState('')
  const [userFullName, setUserFullName] = useState('')
  const { getUserProfile, updateUserProfile } = useSupabaseAuth()
  const navigation: NavigationProp<ParamListBase> = useNavigation()

  const handleGetProfile = async () => {
    setLoading(true)
    try {
      const { error, data, status } = await getUserProfile()
      if (error && status !== 406) {
        setLoading(false)
        throw error
      }
      if (data) {
        console.log(
          '🚀 ~ handleGetProfile ~   data.avatar_url:',
          data.avatar_url
        )

        setUserName(data.username)
        setUserFullName(data.full_name)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserProfile = async () => {
    setLoading(true)
    try {
      const { error } = await updateUserProfile(
        userName,
        userFullName,
        avatarUrl
      )

      if (error) {
        Alert.alert(`Profile update failed ${error?.message}`)
      } else {
        Alert.alert(`Profile Update Successfully`)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile()
      }
    }, [session])
  )

  return (
    <SafeAreaView className="bg-white flex-1">
      <View>
        <View className="flex-row items-center justify-between px-4">
          <View className="w-1/3">
            <Pressable onPress={() => navigation.goBack()}>
              <View className="border-2 border-neutral-500 h-10 w-10 rounded-full items-center justify-center">
                <ChevronLeftIcon size={25} strokeWidth={3} color="gray" />
              </View>
            </Pressable>
          </View>
          <View className="w-1/3">
            <Text className="text-xl font-bold">Edit Profile</Text>
          </View>
          <View className="w-1/3"></View>
        </View>
        {/**Avatar */}
        <View>
          {/**Avatar */}

          <View className="justify-center items-center py-2">
            {/* <View className="h-12 w-12 rounded-2xl overflow-hidden">
            <Avatar url={avatarUrl} size={50} />
          </View> */}
            <View className="overflow-hidden border-2 border-[#2ab07c]  rounded-2xl h-15 w-20">
              <Avatar
                url={avatarUrl || 'https://reactnative.dev/img/tiny_logo.png'}
                size={100}
                showUpload={true}
                onUplaod={(url: string) => setAvatarUrl(url)}
              />
            </View>
          </View>
        </View>
        <View className="px-4">
          {/**Email */}
          <View>
            <Input label="Email" value={session?.user.email} disabled />
          </View>
          {/**User NAME */}
          <View className="space-x-1">
            <Input
              label="Username"
              value={userName || ''}
              onChangeText={(text) => setUserName(text)}
            />
          </View>
          {/**User FullName */}
          <View className="space-x-1">
            <Input
              label="Fullname"
              value={userFullName || ''}
              onChangeText={(text) => setUserFullName(text)}
            />
          </View>
          <Button
            title={loading ? <ActivityIndicator color={'white'} /> : 'Update'}
            action={handleUpdateUserProfile}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
