import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { listFilesInFolder } from '../../../service/fileDownload';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { getPlaceDetails } from '../../../service/food';
import Menu from '../../../components/placeComponents/menu';
import { wkbToCoords } from '../../../utils/location/wkb-coordinates';
import * as Linking from 'expo-linking';
import { useGlobalValues } from '../../../context/GlobalProvider';

async function sharePlace(pageId) {
  const url = Linking.createURL(`page/${pageId}`);
  try {
    await Share.share({
      message: `Check out this page: ${url}`,
      url,
    });
  } catch (e) {
    console.error('Sharing failed', e);
  }
}


export default function Place() {
  const { id }  = useLocalSearchParams(); 
  const [place_details, setPlaceDetails] = useState(null); 
  const [placeImageSources, setPlaceImageSources] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const { userData: { isCreator } } = useGlobalValues();

  useEffect(()=>{
    const get = async() =>{
      const place = (await getPlaceDetails(id));
      setPlaceDetails(place);
    }
    get();
  },[])

  useEffect(()=>{
    if(!place_details) return;
    // Get Place Coordinates
    const coords = wkbToCoords(place_details.place_location);
    setCoordinates(coords);

    // Get Place Images
    const getPics = async() =>{
      await listFilesInFolder('places', `${place_details.place_id}`).then((res) => setPlaceImageSources(res));
    }
    getPics();
  },[place_details])

  const renderPlaceImage = ({ item }) => {
    return(
      <View className={`w-[100vw] h-[40vh]`}>
        <Image source={{ uri: item }} contentFit='cover' placeholder={require('../../../assets/placeholder-image.webp')} placeholderContentFit='cover' className={`w-[100vw] h-[40vh]`} />
      </View>
    )
  }

  if(!place_details) return <View className={`w-full h-full items-center justify-center bg-black`}>
    <ActivityIndicator size='large' color='white' />
  </View>;

  return (
    <>
      <SafeAreaView className={`w-full h-full bg-black`}>
        <ScrollView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1 }}
        >
          <View className={`w-full h-[40vh] flex-row bg-[#FFFFFF11]`}>
            <FlashList
              data={placeImageSources}
              renderItem={renderPlaceImage}
              keyExtractor={(_, index)=>index.toString()}
              estimatedItemSize={10}
              horizontal
              pagingEnabled
            />
            {isCreator &&
            <TouchableOpacity activeOpacity={0.9} onPress={()=>router.push(`/creatorAddPlaceImage/${id}`)} className={`absolute bottom-5 right-5 z-10 bg-black rounded-xl opacity-60`} >
              <Text className={`px-2 py-1 text-white font-poppinsRegular text-sm`}>+ Add Image</Text>
            </TouchableOpacity>
            }
          </View>
          <View className={`w-full`}>
            <View className={`flex-row px-4 pt-4`}>
              <Text className={`w-[80vw] text-white font-poppinsSemiBold text-2xl`}>{place_details.place_name}</Text>
              {place_details.place_rating && <Text className={`w-[45px] h-[25px] bg-[#2D1D90] rounded-xl align-middle text-center text-white font-poppinsSemiBold text-lg`}>{"\u2605 "+place_details.place_rating}</Text>}
            </View>
            <Text className={`w-[100vw] px-4 text-[#C5C4C4CC] font-poppinsRegular text-base`}>{place_details.place_type}</Text>
            <Text className={`w-[100vw] px-4 text-white font-poppinsRegular text-lg`}>{'      '}{place_details.place_description}</Text>
            {place_details?.place_opening_hours && 
              <Text className={`w-full px-5 pt-4 text-[#C5C4C4CC] font-poppinsRegular text-xl`}>Opening Hours: {place_details?.place_opening_hours}</Text>
            }
            {place_details.distance_meters && 
            <Text className={`w-full px-5 pt-5 text-white font-poppinsRegular text-xl`}>
              🚗 {(place_details.distance_meters>1000)? `${(place_details.distance_meters/1000).toFixed(2)} km away` : `${(place_details.distance_meters).toFixed(2)} metres away`}
            </Text>
            }
            <View className={`w-full p-3 gap-3 flex-row flex-wrap`}>
              <TouchableOpacity activeOpacity={0.7} onPress={()=>router.navigate(`https://www.google.com/maps/search/?api=1&query=${coordinates?.latitude},${coordinates?.longitude}`)} className={`px-2 py-1 gap-2 flex-row items-center bg-[#AAAAAA33] border-[1px] border-white rounded-xl `}>
                <Image source={require('../../../assets/home/directions.png')} contentFit='contain' className={`w-[18px] h-[14px]`} />
                <Text className={`align-middle text-white font-poppinsRegular text-lg`}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={()=>sharePlace(place_details.place_id)} className={`px-2 py-1 gap-2 flex-row items-center bg-[#AAAAAA33] border-[1px] border-white rounded-xl `}>
                <Image source={require('../../../assets/home/directions.png')} contentFit='contain' className={`w-[18px] h-[14px]`} />
                <Text className={`align-middle text-white font-poppinsRegular text-lg`}>Share</Text>
              </TouchableOpacity>
            </View>
            {place_details.place_address && <Text className={`w-[80vw] p-4 text-white font-poppinsRegular text-justify text-lg`}>{'📍 '}{place_details.place_address}</Text>}
            <View className={`w-[80vw] self-center h-[1px] my-5`}>
              <LinearGradient colors={['#000000', '#FFFFFF', '#000000']} className={`absolute top-0 bottom-0 left-0 right-0`} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            </View>
          </View>
          <Menu place_id={place_details.place_id} />
        </ScrollView>
        {isCreator &&
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/creatorAddItem/${id}`)} className={`absolute bottom-8 right-8 bg-black rounded-xl border-[1px] border-white`}>
            <Text className={`px-3 py-2 text-white font-poppinsSemiBold text-lg`}>+ Add Item</Text>
          </TouchableOpacity>
        }
      </SafeAreaView>
      <StatusBar animated style='light' hidden={false} />
    </>
  );
}