import useSupabaseAuth from '@/hooks/useSupabaseAuth'
import Avatar from '@/src/components/Avatar'
import { useUserStore } from '@/store/userUserStore'
import { fetchAllCoins } from '@/utils/cryptoapi'
import { Ionicons } from '@expo/vector-icons'
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import numeral from 'numeral'

import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Coin {
  uuid: string
  name: string
  symbol: string
  iconUrl: string
  price: string
  change: number
  marketCap: string
}
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const HomeScreen = () => {
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const { getUserProfile } = useSupabaseAuth()
  const { session } = useUserStore()
  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation()

  const handleGetProfile = async () => {
    setLoading(true)
    try {
      const { error, data, status } = await getUserProfile()
      if (error && status !== 406) {
        setLoading(false)
        throw error
      }
      if (data) {
        setUserName(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.log(error)
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
  const { data: coinsData, isLoading: isAllCoinsLoading } = useQuery({
    queryKey: ['allCoins'],
    queryFn: fetchAllCoins,
  })

  const renderItem = ({ item, index }: { item: Coin; index: number }) => (
    <Pressable
      onPress={() => navigate('CoinDetails', { coinUuid: item?.uuid })}
      className="flex-row w-full py-4 items-center"
    >
      <Animated.View
        entering={FadeInDown.duration(100)
          .delay(index * 200)
          .springify()}
        className={'w-full flex-row items-start'}
      >
        <View className="w-[16%]">
          <View>
            <View className="w-10 h-10">
              <Image
                source={{ uri: item.iconUrl }}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                className="w-full h-full flex-1"
              />
            </View>
          </View>
        </View>

        <View className="w-[55%] justify-start items-start">
          <Text className="font-bold text-lg">{item?.name}</Text>
          <View className="flex-row justify-center items-center space-x-2">
            <Text className={`font-medium text-sm text-neutral-500`}>
              {numeral(parseFloat(item?.price)).format('$0,0.00')}
            </Text>
            <Text
              className={`font-medium text-sm ${
                item?.change < 0
                  ? 'text-red-600'
                  : item?.change > 0
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              {item?.change}%
            </Text>
          </View>
        </View>

        <View className="w-[29%] justify-start items-end">
          <Text className="font-bold text-base">{item?.symbol}</Text>

          <View className="flex-row justify-center items-center space-x-2">
            <Text className="font-medium text-sm text-neutral-700">
              {item?.marketCap?.length > 9
                ? item?.marketCap?.slice(0, 9)
                : item?.marketCap}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  )
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative">
        {/*Header */}

        <View className="w-full flex-row justify-between items-center px-4">
          <View className="w-3/4 flex-row space-x-2">
            <View className="justify-center items-center">
              <View className="h-12 w-12 rounded-2xl overflow-hidden">
                <Avatar url={avatarUrl} size={50} />
              </View>
            </View>
            <View>
              <Text className="text-lg font-bold">
                Hi, {userName ? userName : 'User'}
              </Text>
              <Text className="text-sm text-neutral-500">Have a good day</Text>
            </View>
          </View>
          <View className="py-6">
            <View className="bg-neutral-700 rounded-lg p-1">
              <Ionicons name="menu" size={24} color={'white'} />
            </View>
          </View>
        </View>

        {/*Balance */}

        <View className="mx-4 bg-neutral-800 rounded-[34px] overflow-hidden mt-4 mb-4">
          <View className="bg-[#0DF69E] justify-center items-center py-6 rounded-[34px]">
            <Text className="text-sm font-medium text-neutral-700">
              Total Balance
            </Text>
            <Text className="text-3xl font-extrabold">$2,430.00</Text>
          </View>
          <View className="justify-between items-center flex-row py-4">
            {/*Send to */}
            <View className="w-1/4 justify-between items-center space-y-2">
              <View className="w-10 h-10 overflow-hidden bg[#3B363F] rounded-full p-2">
                <Image
                  source={require('@/assets/images/money-send.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="h-full w-full flex-1"
                />
              </View>
              <Text className="text-white"> send to</Text>
            </View>

            {/*Request */}
            <View className="w-1/4 justify-between items-center space-y-2">
              <View className="w-10 h-10 overflow-hidden bg[#3B363F] rounded-full p-2">
                <Image
                  source={require('@/assets/images/money-receive.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="h-full w-full flex-1"
                />
              </View>
              <Text className="text-white">Request</Text>
            </View>

            {/*Top Up */}
            <View className="w-1/4 justify-between items-center space-y-2">
              <View className="w-10 h-10 overflow-hidden bg[#3B363F] rounded-full p-2">
                <Image
                  source={require('@/assets/images/card-add.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="h-full w-full flex-1"
                />
              </View>
              <Text className="text-white">Top Up</Text>
            </View>

            {/*More */}
            <View className="w-1/4 justify-between items-center space-y-2">
              <View className="w-10 h-10 overflow-hidden bg[#3B363F] rounded-full p-2">
                <Image
                  source={require('@/assets/images/more.png')}
                  placeholder={blurhash}
                  contentFit="cover"
                  transition={1000}
                  className="h-full w-full flex-1"
                />
              </View>
              <Text className="text-white">More</Text>
            </View>
          </View>
        </View>

        {/*Coins render */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-8 items-center">
            {isAllCoinsLoading ? (
              <ActivityIndicator size={'large'} color="back" />
            ) : (
              <FlatList
                nestedScrollEnabled={true}
                scrollEnabled={false}
                data={coinsData?.data?.coins}
                keyExtractor={(item) => item.uuid}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
