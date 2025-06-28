import { View, Text, useWindowDimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalValues } from '../../context/GlobalProvider';
import { getLeastPriceAtPlace, getNearbyPlaces } from '../../service/food';
import { listFilesInFolder } from '../../service/fileDownload';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function PicksForYou({ refresh, setRefresh }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { userData } = useGlobalValues();
  const[places, setPlaces] = useState([]);
  const [imageSources, setImageSources] = useState([]);
  const [leastPrices, setLeastPrices] = useState([]);

  useEffect(()=>{
    const get = async() =>{
      await getNearbyPlaces(userData.id).then((res) => setPlaces(res));
    }
    get();
  },[]);

  useEffect(()=>{
    if(places && places.length > 0){
      places.map(async(value, index) => {
        await listFilesInFolder('places', `${value.place_id}`).then((x) => {
          if(!x) return;
          setImageSources((prev) => {
            const newSources = [...prev];
            newSources[index] = x[0];
            return newSources;
          });
        });
      })
    }
  },[places]);

  useEffect(()=>{
    if(places && places.length > 0){
      places.map(async(value, index) => {
        await getLeastPriceAtPlace(value.place_id).then((res) => {
          if(!res) return;
          setLeastPrices((prev) => {
            const newPrices = [...prev];
            newPrices[index] = res.item_price;
            return newPrices;
          });
        })
      })
    }
  },[places]);

  useEffect(()=>{
    const get = async() =>{
      if(refresh.PicksForYou){
        try{
          await getNearbyPlaces(userData.id).then((res) => setPlaces(res));
        }catch(e){
          console.log(e);
        }
        finally{
          setRefresh((prev)=>({...prev, PicksForYou: false}));
        }
      }
    }
    get();
  },[refresh])

  const renderItem = useCallback(({ item, index, extraData }) => {    
    const onPress = () => {
      router.push(`/place/${item.place_id}`);
    }

    return (
      <TouchableOpacity activeOpacity={.8} onPress={onPress} style={{ width: 136, height: 240, marginLeft: 12, marginRight: 12, borderRadius: 10 }}>
        <View style={{ width: 136, height: 240, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
          <Image source={{ uri: extraData.imageSources[index] }} contentFit='cover' style={{ width: 136, height: 150, borderRadius: 10, backgroundColor: '#FFFFFF33' }} />
          <View style={{ width: 136, paddingHorizontal: 5, paddingBlock: 2 }}>
            <Text numberOfLines={2} ellipsizeMode='tail' className='w-full  text-[16px] text-white font-poppinsMedium'>{item.place_name}</Text>
          </View>
          <View style={{ width: 136, height: 50, justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 5 }}>
            <Text className='w-full text-[12px] text-white font-poppinsMedium'>starting from</Text>
            <Text className='w-full text-[16px] text-white font-poppinsMedium'>₹{extraData.leastPrices[index] || 'loading...'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [places, imageSources, leastPrices]);

  const ListEmptyComponent = () =>(
    <View className={`w-[100vw]`} style={{ height: 240, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}>
      <ActivityIndicator size='large' color='white' />
    </View>
  )

  return (
    <View className={`w-full`} style={{ marginTop: height * 0.45 - (insets.top+110) }}>
      <View className={`w-full flex-row items-center gap-5 px-2`} style={{ height: 70}}>
        <View style={{ height: 1, flexGrow: 1 }}>
          <LinearGradient colors={['#000000', '#FFFFFF']} className={`absolute top-0 bottom-0 left-0 right-0`} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>
        <Text className="text-[20px] text-white font-poppinsRegular">Sehari picks for you</Text>
        <View style={{ height: 1, flexGrow: 1 }}>
          <LinearGradient colors={['#FFFFFF', '#000000']} className={`absolute top-0 bottom-0 left-0 right-0`} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>
      </View>
      <View className={`w-full flex-1`} style={{ height: 270 }}>
        <FlashList
          data={places|| []}
          renderItem={renderItem}
          estimatedItemSize={10}
          keyExtractor={(item) => item.place_id}
          horizontal
          showsHorizontalScrollIndicator={false}
          extraData={{ imageSources, leastPrices }}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </View>
  )
}