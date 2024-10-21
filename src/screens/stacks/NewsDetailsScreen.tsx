import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import React, { useState } from 'react'
import { ActivityIndicator, Dimensions, Pressable, View } from 'react-native'
import {
  BookmarkSquareIcon,
  ChevronLeftIcon,
  ShareIcon,
} from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

// const windowDimensions = Dimensions.get('window');
// const screenDimensions = Dimensions.get('screen');

const { height, width } = Dimensions.get('window')
const NewsDetailsScreen = () => {
  // const [dimensions, setDimensions] = useState({
  //   window: windowDimensions,
  //   screen: screenDimensions,
  // });

  // useEffect(() => {
  //   const subscription = Dimensions.addEventListener(
  //     'change',
  //     ({window, screen}) => {
  //       setDimensions({window, screen});
  //     },
  //   );
  //   return () => subscription?.remove();
  // });

  const { height, width } = Dimensions.get('window')
  const navigation: NavigationProp<ParamListBase> = useNavigation()
  const { params: item } = useRoute()
  const [visible, setVisible] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <View className="w-full flex-row justify-between  items-center px-4 bg-white mb-4">
        <View className="bg-gray-100 p-2 rounded-full item justify-center">
          <Pressable onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={25} strokeWidth={3} color="gray" />
          </Pressable>
        </View>
        <View className="space-x-3 rounded-full items-center justify-center flex-row">
          <View className="bg-gray-100 px-2 rounded-full">
            <ShareIcon size={25} strokeWidth={2} color="gray" />
          </View>
          <View className="bg-gray-100 p-2 rounded-full item justify-center">
            <Pressable onPress={() => navigation.goBack()}>
              <BookmarkSquareIcon size={25} strokeWidth={3} color="gray" />
            </Pressable>
          </View>
        </View>
      </View>
      <WebView
        source={{
          uri: item?.url,
        }}
        onLoadStart={() => setVisible(true)}
        onLoadEnd={() => setVisible(false)}
      />
      {visible && (
        <ActivityIndicator
          size={'large'}
          color={'green'}
          style={{
            position: 'absolute',
            top: height / 2,
            left: width / 2,
          }}
        />
      )}
    </SafeAreaView>
  )
}

export default NewsDetailsScreen
