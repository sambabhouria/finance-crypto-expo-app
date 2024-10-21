import { FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

export default function useCachedResources() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  useEffect(() => {
    async function loadRessourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()
        await Font.loadAsync({
          PlusJakartaSans: require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
          PlusJakartaSansExtraBold: require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
          PlusJakartaSansBold: require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
          PlusJakartaBoldItalic: require('@/assets/fonts/PlusJakartaSans-ExtraLightItalic.ttf'),
          PlusJakartaSansMedium: require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
          PlusJakartaSansMediumItalic: require('@/assets/fonts/PlusJakartaSans-MediumItalic.ttf'),
          ...FontAwesome.font,
        })
      } catch (error) {
        console.log('🚀 ~ loadRessourcesAndDataAsync ~ error:', error)
      } finally {
        setIsLoadingComplete(true)
        SplashScreen.hideAsync()
      }
    }
    loadRessourcesAndDataAsync()
  }, [])
  return isLoadingComplete
}
