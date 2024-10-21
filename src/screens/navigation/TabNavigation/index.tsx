import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import HomeNavigation from './HomeNavigation'
import MarketNavigation from './MarketNavigation'
import NewsNavigation from './NewsNavigation'
import ProfileNavigation from './ProfileNavigation'
import SearchNavigation from './SearchNavigation'

const Tab = createBottomTabNavigator()
const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName: typeof Ionicons.defaultProps
          if (route.name === 'Home') iconName = 'home'
          else if (route.name === 'Market') iconName = 'stats-chart-outline'
          else if (route.name === 'Search') iconName = 'search-outline'
          else if (route.name === 'News') iconName = 'newspaper-outline'
          else if (route.name === 'Profile') iconName = 'person-outline'
          const customizeSize = 25
          return (
            <Ionicons
              name={iconName}
              size={customizeSize}
              color={focused ? '#164b48' : 'gray'}
            />
          )
        },
        tabBarActiveTintColor: '#164b48',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        ...TransitionPresets.SlideFromRightIOS,
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      <Tab.Screen name="Market" component={MarketNavigation} />
      <Tab.Screen name="Search" component={SearchNavigation} />
      <Tab.Screen name="News" component={NewsNavigation} />
      <Tab.Screen name="Profile" component={ProfileNavigation} />
      {/**Deatils screen */}
    </Tab.Navigator>
  )
}

export default TabNavigation
