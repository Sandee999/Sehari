import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { getNearbyItems } from '../../service/food';
import { useGlobalValues } from '../../context/GlobalProvider';
import { router } from 'expo-router';

export default function UnderTheMoon() {
  const { userData } = useGlobalValues();
  const [items, setItems] = useState([]);

  useEffect(()=>{
    const get = async() =>{
      const data = await getNearbyItems(userData.id);
      setItems(data);
    }
    get();
  },[])

  const renderItem = useCallback(({ item }) => {    
    const onPress = () => {
      router.push(`/item/${item.item_id}`);
    }

    return (
      <TouchableOpacity activeOpacity={.8} onPress={onPress} style={{ width: 136, height: 250, marginLeft: 12, marginRight: 12, borderRadius: 10 }}>
        <View style={{ width: 136, height: 250, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#FFFFFF11' }}>
          <Image 
            source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/items/${item.item_id}/itemImage.jpg` }} 
            contentFit='cover' 
            style={{ width: 136, height: 150, borderRadius: 10, backgroundColor: '#FFFFFF33' }}
            placeholderContentFit='cover' 
            placeholder={require('../../assets/placeholder-image.webp')}
          />
          <View style={{ width: 136, paddingHorizontal: 5, paddingBlock: 2 }}>
            <Text numberOfLines={2} ellipsizeMode='tail' className='w-full  text-[16px] text-white font-poppinsMedium'>{item.item_name}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' className='w-full text-[12px] text-white font-poppinsLight'>{item.place_name}</Text>
          </View>
          <View style={{ width: 136, justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 5 }}>
            <Text className='w-full text-[16px] text-white font-poppinsMedium'>₹{item.item_price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [items]);

  return (
    <View className={`w-full items-center justify-center`}>
      <View className={`w-full flex-row items-center gap-5 px-2`} style={{ height: 50}}>
        <View style={{ height: 1, flexGrow: 1 }}>
          <LinearGradient colors={['#000000', '#FFFFFF']} className={`absolute top-0 bottom-0 left-0 right-0`} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>
        <Text className="text-[20px] text-white font-poppinsRegular">Under The Moon</Text>
        <View style={{ height: 1, flexGrow: 1 }}>
          <LinearGradient colors={['#FFFFFF', '#000000']} className={`absolute top-0 bottom-0 left-0 right-0`} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>
      </View>
      <View className={`w-[90vw]`}>
        <View className={`w-full h-[45vh] border-[.5px] border-white rounded-lg`}>
          <Image
            source={require('../../assets/home/homeBG.gif')} 
            contentFit='cover'
            className={`flex-1 rounded-lg`}
          />
          <Text className={`px-4 pt-4 font-poppinsMedium text-white text-xl`}>DUM MAARO DUM : Multi Cuisine .... Multi Cultural ..</Text>
          <Text className={`px-4 py-2 font-poppinsRegular text-amber-400 text-lg`}>Jntu,back of nexus mall, ..</Text>
        </View>
      </View>
      <View className={`w-[100vw] flex-1 mt-5 flex-row items-center`} style={{ height: 270 }}>
        <FlashList
          data={items || []}
          renderItem={renderItem}
          estimatedItemSize={10}
          keyExtractor={(item) => item.item_id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={()=>(
            <View className={`w-[100vw] flex-1 items-center justify-center`}>
              <ActivityIndicator size='large' color='#FFFFFF' />
            </View>
          )}
        />
      </View>
    </View>
  );
}