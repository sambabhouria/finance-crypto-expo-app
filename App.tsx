import useCachedResources from '@/hooks/useCachedRessources'
import RootNavigation from '@/src/screens/navigation/RootNavigation'
import { useUserStore } from '@/store/userUserStore'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App = () => {
  const isLoadingComplete = useCachedResources()
  const queryClient = new QueryClient()
  const { user, session } = useUserStore()
  useEffect(() => {
    console.log(user, session)
  }, [user, session])
  console.log('🚀 ~ useEffect ~ session:', session?.user.id)

  if (!isLoadingComplete) return null

  return (
    <Container>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </Container>
  )
}

export default App

const Container = styled(View)`
  flex: 1;
`
