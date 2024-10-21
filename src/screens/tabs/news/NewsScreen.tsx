import { feetchCryptoNews } from '@/utils/cryptoapi'
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native'
import { BookmarkSquareIcon } from 'react-native-heroicons/outline'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

/***
   * import { useNavigation, ParamListBase,  NavigationProp } from '@react-navigation/native';
    const navigation: NavigationProp<ParamListBase> = useNavigation();
   */
const NewsScreen = () => {
  const { data: newSData, isLoading: isNewsLoading } = useQuery({
    queryKey: ['cryptonews'],
    queryFn: feetchCryptoNews,
  })

  // const navigation = useNavigation()
  const navigation: NavigationProp<ParamListBase> = useNavigation()
  const handleClick = (item: any) => navigation.navigate('NewsDetails', item)

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Pressable
      onPress={() => handleClick(item)}
      className="mb-4 mx-4 space-y-1"
      key={index}
    >
      <View className="flex-row justify-start w-[100%] shadow-sm">
        {/**Image */}
        <View className="items-start justify-start w-[20%]">
          <Image
            source={{ uri: item?.thumbnail ? item?.thumbnail : item?.iconUrl }}
            placeholder={blurhash}
            style={{
              width: hp(9),
              height: hp(10),
            }}
            resizeMode="cover"
            className="rounded-lg"
          />
        </View>
        {/**Content */}
        <View className="w-[70%] pl-4 justify-center space-x-1">
          {/**Description */}
          <Text className="text-xs font-bold text-gray-900">
            {item?.description?.length > 20
              ? item?.description?.slice(0, 20)
              : item?.description + '...'}
          </Text>
          {/**Description */}
          <Text className="text-neutral-800 capitalize max-w-[90%]">
            {item?.title?.length > 50
              ? item?.title?.slice(0, 50)
              : item?.title + '...'}
          </Text>
          {/**Date */}

          <Text className="text-xs text-gray-700">{item?.createdAt}</Text>
        </View>
        {/**Bookmark right */}
        <View className="w-[10%] justify-center">
          <BookmarkSquareIcon color={'gray'} />
        </View>
      </View>
    </Pressable>
  )

  return (
    <SafeAreaView className="sapce-y-2 border-white dark:bg-neutral-500 flex-1">
      {/**Header */}
      <View className="w-full flex-row justify-between items-center px-4 pb-4">
        <View className="w-3/4 flex-row space-x-2">
          <Text className="text-3xl font-bold">Crypto News</Text>
        </View>
      </View>

      {/**Main News */}
      <View className="">
        {newSData && newSData?.data ? (
          <FlatList
            data={newSData.data}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        ) : (
          <ActivityIndicator size={'large'} color={'black'} />
        )}
      </View>
    </SafeAreaView>
  )
}

export default NewsScreen
