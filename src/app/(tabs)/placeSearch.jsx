import { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalValues } from '../../context/GlobalProvider';
import { getNearbyPlacesByText, getNearbyItemsByText } from '../../service/food';
import { listFilesInFolder } from '../../service/fileDownload';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

export default function PlaceSearch() {
  const { userData } = useGlobalValues();
  const [ searchText, setSearchText ] = useState('');
  const [places, setPlaces] = useState([]);
  const [imageSourceOfPlaces, setImageSourceOfPlaces] = useState([]);
  const [ items, setItems ] = useState([]);

  // For Places
  useEffect(()=>{
    const get = async () => {
      const data = await getNearbyPlacesByText(userData.id, searchText);
      setPlaces(data);
    }
    get();
  },[searchText]);

  useEffect(()=>{
    setImageSourceOfPlaces([]);
    if(places){
      places.map(async(value, index) => {
        await listFilesInFolder('places', `${value.place_id}`).then((x) => {
          setImageSourceOfPlaces((prev) => {
            const newSources = [...prev];
            newSources[index] = x[0];
            return newSources;
          });
        });
      })
    }
  },[places]);

  // For Items
  useEffect(()=>{
    const get = async () => {
      const data = await getNearbyItemsByText(userData.id, searchText);
      setItems(data);
    }
    get();
  },[searchText]);

  return (
    <>
      <SafeAreaView className={`w-full h-full items-center justify-start bg-black`}>
        <Image source={require('../../assets/search/blurImage.png')} contentFit='fill' className={`w-[100vw] h-[50vw] absolute`} />
        <View className={`w-[90vw] mt-3 flex-row bg-[#FFFFFF33] border-2 border-neutral-300 rounded-2xl`} style={{ height: 43 }}>
          <MaterialIcons name="search" size={24} color="#A3A3A3" style={{ width: 43, height: 43, paddingBottom: 2, textAlign: 'center', textAlignVertical: 'center' }} />
          <View className={`flex-1`}>
            <TextInput 
              className={`w-full h-full ${!searchText ?'mt-2 pt-1': 'mt-1'} text-lg text-white font-poppinsRegular`}
              placeholder='Search for idlli with...'
              placeholderTextColor={'#A3A3A3'}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>
        </View>
        {/* Items */}
        <View className={`w-[90vw] h-[12vh] flex-row mt-3`}>
          <FlashList
            data={items}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.replace(`/item/${item.item_id}`)}>
                <View className={`w-[8vh] h-[12vh] mr-[2vh] items-center justify-center`}>
                  <Image 
                    className={`w-[8vh] h-[8vh] rounded-full`} 
                    source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/items/${item.item_id}/itemPic.jpg`}} 
                    contentFit='cover' placeholder={require('../../assets/placeholder-image.webp')} 
                    placeholderContentFit='cover' 
                  />
                  <Text numberOfLines={2} ellipsizeMode='tail' className='w-full px-3 text-left text-white font-poppinsSemiBold text-xs'>{item.item_name}</Text>
                </View>
              </TouchableOpacity>
            )}
            estimatedItemSize={100}
            keyExtractor={(item) => item.item_id}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => {
              if(searchText.trim().length > 0) return(
                <View className={`w-[100vw] h-[12vh] mr-[2vh] items-center justify-center`}>
                  <Text className='text-white font-poppinsSemiBold text-xl'>Not found</Text>
                </View>
              )
            }}
          />
        </View>
        {/* Margin  */}
        {searchText.trim().length > 0 && <View className={`w-[100vw] h-[2px] bg-[#A3A3A3] mt-3`} />}
        {/* Places */}
        <ScrollView contentContainerclassName={`w-full h-full items-center justify-start`}>
          <View className={`flex-grow-[1] mt-3 items-start justify-center`}>
            {places.map((item, index) => (
              <TouchableOpacity activeOpacity={0.8} key={item.place_id} onPress={() => router.replace(`/place/${item.place_id}`)}>
                <View className={`w-[90vw] h-[100px] flex-row items-center justify-center  rounded-3xl`}>
                  <Image 
                    className={`w-[70px] h-[70px] rounded-xl`} 
                    source={{ uri: imageSourceOfPlaces[index] }} 
                    contentFit='cover' placeholder={require('../../assets/placeholder-image.webp')} 
                    placeholderContentFit='cover' 
                  />
                  <View className={`flex-1 items-center justify-center`}>
                    <Text numberOfLines={1} ellipsizeMode='tail' className='w-full px-3 text-left text-white font-poppinsSemiBold text-lg'>{item.place_name}</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' className='w-full px-3 text-left text-[#A3A3A3] font-poppinsSemiBold text-sm'>{item.place_type}</Text>
                    {item.place_rating &&
                      <Text numberOfLines={1} ellipsizeMode='tail' className='w-full px-3 text-left text-white font-josefinMedium text-lg'>{"\u2605 "+item.place_rating}</Text>
                    }
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar animated style='light' hidden={false} />
    </>
  );
}