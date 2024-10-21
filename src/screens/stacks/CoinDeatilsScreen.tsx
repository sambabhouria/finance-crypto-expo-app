import { fetchCoinDetails, fetchCoinHistory } from '@/utils/cryptoapi'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Circle, useFont } from '@shopify/react-native-skia'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Image } from 'expo-image'
import numeral from 'numeral'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CartesianChart, Line, useChartPressState } from 'victory-native'

type ParamList = {
  CoinDetails: {
    coinUuid: string
  }
}
/**
 * 
 * @returns 
 * import { RouteProp } from '@react-navigation/native';

  export type RootStackParamList = {
    Home: undefined;
    Feed: { sort: 'latest' | 'top' };
  };

  export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<
    RootStackParamList,
    RouteName
  >;
Usage:

  export const Feed = () => {    
    const route = useRoute<RootRouteProps<'Feed'>>();
    return <Text>{route.params.sort}</Text>
  }
      // const {
    //   params: { coinUuid },
    // } = useRoute()
 */

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const CoinDeatilsScreen = () => {
  const {
    params: { coinUuid },
  } = useRoute<RouteProp<ParamList, 'CoinDetails'>>()
  const font = useFont(require('@/assets/fonts/PlusJakartaSans-Bold.ttf'), 12)
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } })
  const navigation = useNavigation()

  const [lineData, setLineData] = useState<any>([])
  const [item, setItem] = useState<any>({})

  const ToolTip = ({
    x,
    y,
  }: {
    x: SharedValue<number>
    y: SharedValue<number>
  }) => {
    return <Circle cx={x} cy={y} r={8} color={'red'} />
  }

  const { data: coinDetails, isLoading: isCoinDetailsLoading } = useQuery({
    queryKey: ['CoinDetails', coinUuid],
    queryFn: () => coinUuid && fetchCoinDetails(coinUuid),
  })

  const { data: coinHistory, isLoading: isCoinHistoryLoading } = useQuery({
    queryKey: ['CoinHistory', coinUuid],
    queryFn: () => coinUuid && fetchCoinHistory(coinUuid),
  })

  useEffect(() => {
    if (coinHistory && coinHistory?.data?.history) {
      const datasets = coinHistory.data.history.map((item: any) => ({
        price: parseFloat(item?.price),
        timestamp: item?.timestamp,
      }))
      setLineData && setLineData(datasets)
    }

    if (coinDetails && coinDetails?.data?.coin) {
      setItem(coinDetails.data.coin)
    }
  }, [coinHistory, coinDetails])

  return (
    <View className="flex-1 bg-white">
      {isCoinDetailsLoading || isCoinHistoryLoading ? (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.45]"></View>
          <View className="absolute">
            <ActivityIndicator size={'large'} color={'white'} />
          </View>
        </View>
      ) : (
        <SafeAreaView>
          <View className="flex-row items-center justify-between px-4">
            <Pressable
              onPress={() => navigation.goBack()}
              className="border-2 border-neutral-500 rounded-full p-1 "
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={24}
                color={'gray'}
              />
            </Pressable>

            <View>
              <Text className="font-bold text-lg">{item?.symbol}</Text>
            </View>

            <View className="border-2 border-neutral-500 rounded-full p-1">
              <Entypo name="dots-three-horizontal" size={24} color={'gray'} />
            </View>
          </View>

          <View className="px-4 justify-center items-center py-2">
            <Text className={`font-extrabold text-2xl`}>
              {numeral(parseFloat(item?.price)).format('$0,0.00')}
            </Text>
          </View>

          {item && (
            <View className="flex-row justify-center items-center sx-2 px-4 py-2">
              <View className="flex-row w-full py-4 items-center">
                <View className="w-[16%]">
                  <View className="w-10 h-10">
                    <Image
                      source={{ uri: item?.iconUrl }}
                      placeholder={blurhash}
                      contentFit="cover"
                      transition={1000}
                      className="w-full h-full flex-1"
                    />
                  </View>
                </View>

                <View className="w-[55%] justify-start items-start">
                  <Text className="font-bold text-lg">{item?.name}</Text>
                  <View className="flex-row justify-center items-center space-x-2">
                    <Text className="font-medium text-sm text-neutral-500">
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
              </View>
            </View>
          )}
        </SafeAreaView>
      )}
      <View style={{ height: 400, paddingHorizontal: 10 }}>
        {lineData && (
          <CartesianChart
            chartPressState={state}
            axisOptions={{
              font,
              tickCount: 8,
              labelOffset: { x: -1, y: 0 },
              labelColor: 'green',
              formatXLabel: (ms) => format(new Date(ms * 1000), 'MM/dd'),
            }}
            data={lineData}
            xKey={'timestamp' as never}
            yKeys={['price'] as never[]}
          >
            {({ points }) => (
              <>
                <Line points={points?.price} color={'green'} strokeWidth={2} />
                {isActive && (
                  <ToolTip x={state.x.position} y={state.y.price.position} />
                )}
              </>
            )}
          </CartesianChart>
        )}
      </View>
      <View className="px-4 py-4">
        {/**All Time Hight */}
        <View className="flex-row justify-between ">
          <Text className="text-base font-bold text-neutral-500">
            All Time Hight
          </Text>
          <Text className={`font-extrabold text-base`}>
            {numeral(parseFloat(item?.allTimeHight?.price)).format('$0,0.00')}
          </Text>
        </View>
        {/**Number of Markets */}
        <View className="flex-row justify-between ">
          <Text className="text-base font-bold text-neutral-500">
            Number of Market
          </Text>
          <Text className={`font-extrabold text-base`}>
            {numeral(parseFloat(item?.numberOfMarkets)).format('$0,0.00')}
          </Text>
        </View>
        {/**Number of Exchanges */}
        <View className="flex-row justify-between ">
          <Text className="text-base font-bold text-neutral-500">
            Number of Exchanges
          </Text>
          <Text className={`font-extrabold text-base`}>
            {numeral(parseFloat(item?.numberOfExchanges)).format('$0,0.00')}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default CoinDeatilsScreen
