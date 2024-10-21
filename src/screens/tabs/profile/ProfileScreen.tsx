import useSupabaseAuth from '@/hooks/useSupabaseAuth'
import Avatar from '@/src/components/Avatar'
import { useUserStore } from '@/store/userUserStore'
import { MaterialIcons } from '@expo/vector-icons'
import {
  NavigationProp,
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const ProfileScreen = () => {
  const [loading, setLoading] = useState(false)
  const { session } = useUserStore()
  const [avatarUrl, setAvatarUrl] = useState('')
  const [userName, setUserName] = useState('')
  const { getUserProfile, signOut } = useSupabaseAuth()
  const navigation: NavigationProp<ParamListBase> = useNavigation()
  const handleEditMyProfile = () => navigation.navigate('EditProfileS')

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
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const handleSignOut = async () => await signOut()

  useFocusEffect(
    useCallback(() => {
      if (session) {
        handleGetProfile()
      }
    }, [session])
  )
  return (
    <View className="flex-1 bg-white">
      <View>
        {/**Avatar */}

        <View className="justify-center items-center py-14 pb-20 bg-[#2ab07c]">
          {/* <View className="h-12 w-12 rounded-2xl overflow-hidden">
            <Avatar url={avatarUrl} size={50} />
          </View> */}
          <View className="overflow-hidden border-2 border-white rounded-3xl h-15 w-20">
            <Avatar
              url={avatarUrl || 'https://reactnative.dev/img/tiny_logo.png'}
              size={100}
            />
          </View>
          <View className="w-full py-3 items-center">
            <Text className="text-lg font-bold text-white ">{userName}</Text>
          </View>
        </View>
        <View
          className="bg-white px-4 py-6 -mt-11"
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Text className="text-lg font-bold pb-2">Account OverFlow</Text>
        </View>
        {/**Edit My Profile */}
        <View className="p-2 py-3 bg-gray-100 rounded-xl border-gray-300 my-3 mx-2">
          <Pressable
            className="flex-row justify-between items-center"
            onPress={handleEditMyProfile}
          >
            <View className="flex-row justify-center items-center space-x-2">
              <View className="bg-[#2ab07c] p-1 rounded-lg">
                <MaterialIcons name="person-4" size={24} color={'white'} />
              </View>
              <Text className="text-lg text-gray-600 font-semibold">
                Edit My Profile
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color={'black'} />
          </Pressable>
        </View>
        {/**Change Password */}
        <View className="p-2 py-3 bg-gray-100 rounded-xl border-gray-300 my-3 mx-2">
          <Pressable
            className="flex-row justify-between items-center"
            onPress={() => {}}
          >
            <View className="flex-row justify-center items-center space-x-2">
              <View className="bg-[#2ab07c] p-1 rounded-lg">
                <MaterialIcons name="password" size={24} color={'white'} />
              </View>
              <Text className="text-lg text-gray-600 font-semibold">
                Change Password
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color={'black'} />
          </Pressable>
        </View>
        {/**Log out */}
        <View className="p-2 py-3 bg-gray-100 rounded-xl border-gray-300 my-3 mx-2">
          <Pressable
            className="flex-row justify-between items-center"
            onPress={handleSignOut}
          >
            <View className="flex-row justify-center items-center space-x-2">
              <View className="bg-[#2ab07c] p-1 rounded-lg">
                <MaterialIcons name="logout" size={24} color={'white'} />
              </View>
              <Text className="text-lg text-gray-600 font-semibold">
                Log out
              </Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color={'black'} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default ProfileScreen
