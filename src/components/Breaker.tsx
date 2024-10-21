import React from 'react'
import { Text, View } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Breaker = () => {
  return (
    <Animated.View
      entering={FadeInRight.duration(100).delay(500).springify()}
      className="flex-row w-full"
    >
      {/**Breaker left line */}

      <View className="h-10 w-[40%] justify-center items-center">
        <View className="border-t-2 border-gray-400 w-full"></View>
      </View>

      {/**OR text */}
      <View className="w-[20%] justify-center items-center">
        <Text className="text-base text-neutral-500">OR</Text>
      </View>

      {/**Breaker right line */}

      <View className="h-10 w-[40%] justify-center items-center">
        <View className="border-t-2 border-gray-400 w-full"></View>
      </View>
    </Animated.View>
  )
}

export default Breaker
