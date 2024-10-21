import { searchCoin } from '@/utils/cryptoapi'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Image } from 'expo-image'
import { debounce } from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { XMarkIcon } from 'react-native-heroicons/outline'
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

const SearchScreen = () => {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>([])

  const { navigate }: NavigationProp<ScreenNavigationType> = useNavigation()
  const { navigate: navigateHome }: NavigationProp<HomeNavigationType> =
    useNavigation()

  const handleSearch = async (search: string) => {
    if (search && search.length > 2) {
      setLoading(true)
      try {
        const res = await searchCoin(search)
        console.log('🚀 ~ handleSearch ~ res:', res)
        if (res) setResults(res)
      } catch (error) {
        console.log('🚀 ~ handleSearch ~ error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

  const renderItem = ({ item, index }: { item: Coin; index: number }) => (
    <Pressable
      onPress={() => navigate('CoinDetails', { coinUuid: item?.uuid })}
      className="flex-row w-full py-4 items-center px-4"
      key={item?.uuid}
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
            {/* <Text
              className={`font-medium text-sm ${
                item?.change < 0
                  ? 'text-red-600'
                  : item?.change > 0
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              {item?.change}%
            </Text> */}
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
    <SafeAreaView className="bg-white flex-1">
      {/**Header */}
      <View className="w-full flex-row justify-between items-center px-4 pb-4">
        <View className="w-3/4 flex-row space-x-4">
          <Text className="text-3xl font-bold">Search</Text>
        </View>
      </View>
      {/**Sarch field */}
      <View className="mx-4 mb-3 flex-row p-2  border-2 justify-between items-center bg-white rounded-lg shadow-sm">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search for your coin"
          placeholderTextColor={'gray'}
          className="pl-0 flex-1 font-medium text-base tracking-wide"
        />
        <Pressable onPress={() => navigateHome('HomeS')}>
          <XMarkIcon size="25" color="black" />
        </Pressable>
      </View>

      <View className="mt-4">
        {loading ? (
          <ActivityIndicator size={'large'} color={'#164b48'} />
        ) : (
          <View>
            <FlatList
              data={results?.data?.coins}
              keyExtractor={(item) => item?.uuid}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({})
