import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack'
import React from 'react'
import EditProfileScreen from '../../tabs/profile/EditProfileScreen'
import ProfileScreen from '../../tabs/profile/ProfileScreen'
const Stack = createStackNavigator()

const ProfileNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="ProfileS" component={ProfileScreen} />
      <Stack.Screen name="EditProfileS" component={EditProfileScreen} />
    </Stack.Navigator>
  )
}

export default ProfileNavigation
