import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { getItemDetailsById } from '../../../service/food';
import { Image } from 'expo-image';
import { wkbToCoords } from '../../../utils/location/wkb-coordinates';

function shareItem(item_id){
  Sharing.shareAsync(`sehari://item/${item_id}`);
}

export default function Item() {
  const { id } = useLocalSearchParams();
  const [ itemDetails, setItemDetails ] = useState({});
  const [coordinates, setCoordinates] = useState({});

  useEffect(()=>{
    const get = async() =>{
      const item = await getItemDetailsById(id);
      setItemDetails(item);
    }
    get();
  },[]);

  useEffect(()=>{
    if(!itemDetails) return;
    if(!itemDetails.place_location) return;

    const coords = wkbToCoords(itemDetails.place_location);
    setCoordinates(coords);
  }, [itemDetails])

  return (
    <>
      <SafeAreaView className='w-full h-full bg-black'>
        <ScrollView className='w-full h-[100vh]'>
          <Image 
            source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/items/${id}/itemPic.jpg`}} 
            contentFit='cover'
            className='w-[100vw] h-[40vh]'
            placeholder={require('../../../assets/placeholder-image.webp')}
          />
          <View className={`flex-row px-4 pt-4`}>
            <Text className={`w-[80vw] text-white font-poppinsSemiBold text-2xl`}>{itemDetails.item_name}</Text>
            {itemDetails.item_rating && <Text className={`w-[45px] h-[25px] bg-[#2D1D90] rounded-xl align-middle text-center text-white font-poppinsSemiBold text-lg`}>{"\u2605 "+itemDetails.item_rating}</Text>}
          </View>
          <Text className={`w-[100vw] px-4 text-[#C5C4C4CC] font-poppinsRegular text-base`}>{itemDetails.place_name} {itemDetails.place_address}</Text>
          <View className={`w-full p-3 gap-3 flex-row flex-wrap`}>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>router.navigate(`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`)} className={`px-2 py-1 gap-2 flex-row items-center bg-[#AAAAAA33] border-[1px] border-white rounded-xl `}>
              <Image source={require('../../../assets/home/directions.png')} contentFit='contain' className={`w-[18px] h-[14px]`} />
              <Text className={`align-middle text-white font-poppinsRegular text-lg`}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={()=>shareItem(itemDetails.item_id)} className={`px-2 py-1 gap-2 flex-row items-center bg-[#AAAAAA33] border-[1px] border-white rounded-xl `}>
              <Image source={require('../../../assets/home/share.png')} contentFit='contain' className={`w-[19px] h-[20px]`} />
              <Text className={`align-middle text-white font-poppinsRegular text-lg`}>Share</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar animated style='light' hidden={false} />
    </>
  )
}