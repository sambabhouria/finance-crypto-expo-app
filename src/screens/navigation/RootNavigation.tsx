import { useUserStore } from '@/store/userUserStore'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import React from 'react'
import AuthNavigation from './AuthNavigation'
import TabNavigation from './TabNavigation'

const Stack = createStackNavigator()

const RootNavigation = () => {
  const { session } = useUserStore()
  console.log('🚀 ~ RootNavigation ~ session:', session)
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {session && session?.user ? (
          <Stack.Screen name="TabNavigation" component={TabNavigation} />
        ) : (
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigation
