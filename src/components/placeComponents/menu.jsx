import { View, Text, TouchableHighlight, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { getItemDetailsByPlace } from '../../service/food';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';

export default function Menu({ place_id }) {
  const [items, setItems] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const get = async() => {
      const item_details = await getItemDetailsByPlace(place_id);
      setItems(item_details);
      setLoading(true);
    }
    get();
  },[]);


  const renderItem = useCallback(({ item }) => {

    return(
      <TouchableHighlight underlayColor={'#FFFFFF11'} onPress={()=>router.push(`/item/${item.item_id}`)}>
        <View className={`w-[90vw] flex-row self-center items-center justify-center rounded-xl bg-[#FFFFFF11]`}>
          <View className={`w-[70vw] h-[20vw] p-3 items-start justify-between`} >
            <Text className='text-white font-josefinRegular text-lg'>{'🍽️ '}{item.item_name}</Text>
            <Text className='px-2 text-white font-josefinLight text-lg'>at {'₹'}{item.item_price}</Text>
          </View>
          <View className={`w-[20vw] h-[20vw] p-2 items-center justify-between rounded-xl`} >
            {item.item_rating &&
              <Text className={`p-1 text-xs bg-[#2D1D90DD] absolute z-10 top-3 right-3 rounded-lg align-middle text-center text-white font-josefinRegular`}>{"\u2605 "+item.item_rating}</Text>
            }
            <Image 
              source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/items/${item.item_id}/itemPic.jpg`}} 
              contentFit='cover' 
              placeholder={require('../../assets/placeholder-image.webp')}
              placeholderContentFit='cover'
              className={`w-full h-full rounded-xl bg-black`}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  },[items]);

  const itemSeparatorComponent = useCallback(() => (
    <View className={`w-[80vw] self-center my-2`} />
  ),[]);

  const ListEmptyComponent = useCallback(() => {
    if(loading) return(
      <View className={`w-[100vw]`} style={{ height: 240, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }} >
        <ActivityIndicator size='large' color='white' />
      </View>
    )

    return(
      <View className={`w-[100vw]`} style={{ height: 240, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }} >
        <Text className='w-full text-center align-middle text-white font-poppinsMedium text-lg'>None found</Text>
      </View>
    )
  },[]);

  return (
    <View className={`w-full min-h-[20vh] flex-grow-[1] items-center justify-start`}>
      <Text className='w-full px-7 text-left align-middle text-white font-josefinLight text-2xl'>Menu</Text>
      <View className={`w-full flex-grow-[1]`}>
        <FlashList 
          data={items}
          renderItem={renderItem}
          estimatedItemSize={10}
          ListHeaderComponent={itemSeparatorComponent}
          ItemSeparatorComponent={itemSeparatorComponent}
          ListFooterComponent={itemSeparatorComponent}
          keyExtractor={(item) => item.item_id}
          scrollEnabled={false}
          ListEmptyComponent={ListEmptyComponent}
        />
      </View>
    </View>
  );
}