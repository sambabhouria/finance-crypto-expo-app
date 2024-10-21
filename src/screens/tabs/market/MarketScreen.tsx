import { fetchAllCoins } from '@/utils/cryptoapi'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import numeral from 'numeral'

import React, { useState } from 'react'
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

const MarketScreen = () => {
  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation()
  const [topGainers, setTopGainers] = useState([])
  const [topLosers, setTopLosers] = useState([])
  const [active, setActive] = useState('all')

  const { data: coinsData, isLoading: isAllCoinsLoading } = useQuery({
    queryKey: ['allCoins'],
    queryFn: fetchAllCoins,
  })

  const allCoins = () => {
    setActive('all')
  }
  const calculateTopGainers = () => {
    setActive('gainers')
    const gainers = coinsData?.data?.coins?.filter(
      (coin: any) => parseFloat(coin.change) > 0
    )
    setTopGainers(gainers)
  }

  const calculateTopLosers = () => {
    setActive('losers')
    const losers = coinsData?.data?.coins?.filter(
      (coin: any) => parseFloat(coin.change) < 0
    )
    setTopLosers(losers)
  }

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
        <View className="w-full flex-row justify-between  items-center px-4 pb-4">
          <View className="w-3/4 flex-row space-x-2">
            <View>
              <Text className="text-3xl font-bold">Market</Text>
            </View>
          </View>
        </View>
        {/**Hearder tabs */}
        <View className="px-4 flex-row justify-between items-center pb-4">
          {/**ALL */}
          <Pressable
            className={`w-1/4 justify-center items-center py-1 ${
              active === 'all' ? 'border-b-4 border-blue-500' : ''
            }`}
            onPress={allCoins}
          >
            <Text
              className={`text-lg ${active === 'all' ? 'font-extrabold' : ''}`}
            >
              All
            </Text>
          </Pressable>
          {/**Gainers */}
          <Pressable
            className={`w-1/4 justify-center items-center py-1 ${
              active === 'gainers' ? 'border-b-4 border-blue-500' : ''
            }`}
            onPress={calculateTopGainers}
          >
            <Text
              className={`text-lg ${
                active === 'gainers' ? 'font-extrabold' : ''
              }`}
            >
              Gainers
            </Text>
          </Pressable>
          {/** Losers */}
          <Pressable
            className={`w-1/4 justify-center items-center py-1 ${
              active === 'losers' ? 'border-b-4 border-blue-500' : ''
            }`}
            onPress={calculateTopLosers}
          >
            <Text
              className={`text-lg ${
                active === 'losers' ? 'font-extrabold' : ''
              }`}
            >
              Losers
            </Text>
          </Pressable>
        </View>

        {/*Coins render */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 py-8 items-center">
            {/*All*/}
            {active === 'all' && (
              <View className="px-4 items-center">
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
            )}
            {/*Gainers*/}
            {active === 'gainers' && (
              <View className="px-4 items-center">
                {isAllCoinsLoading ? (
                  <ActivityIndicator size={'large'} color="back" />
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={topGainers}
                    keyExtractor={(item) => item.uuid}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
            )}
            {/* Loosers */}
            {active === 'losers' && (
              <View className="px-4 items-center">
                {isAllCoinsLoading ? (
                  <ActivityIndicator size={'large'} color="back" />
                ) : (
                  <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={topLosers}
                    keyExtractor={(item) => item.uuid}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default MarketScreen
