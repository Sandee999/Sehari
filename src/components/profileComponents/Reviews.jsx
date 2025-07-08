import { FlashList } from '@shopify/flash-list';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { getAllUserItemRatings } from '../../service/userData';
import { Image } from 'expo-image';

export default function Reviews({ id }) {
  const [data, setData] = useState([]);
  // useEffect(()=>console.log(data[0]),[data]);
  const limit = 5;
  const [page, setPage] = useState(-1);
  const [hasMore, setHasMore] = useState(true);
  // useEffect(()=>console.log(page),[page]);
  
  useEffect(()=>{
    async function get() {
      const { data, error } = await getAllUserItemRatings(id, page*limit, (page+1)*limit-1);
      if(error) {
        Alert.alert('Error', error.message || String(error));
        return;
      }
      if(data.length < limit) setHasMore(false);
      setData((prev) => {
        const combined = [...prev, ...data];
        const unique = Array.from(new Map(combined.map(item => [item.item_id, item])).values());
        return unique;
      });
    }
    get();
  },[page]);

  const renderItem = useCallback(({item}) => {
    console.log(item)
    return( 
      <View className={`w-full flex-1 px-3 py-2 mb-3 bg-[#222] border-[1px] border-[#AAA] rounded-lg`}>
        <View className={`w-full gap-2 flex-row items-center`}>
          <View className={`w-[40px] h-[40px] rounded-full`}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/items/${item.item_id}/itemPic.jpg` }}
              className={`z-10 flex-1 rounded-full`}
              contentFit='cover'
              placeholder={require('../../assets/placeholder-image.webp')}
              placeholderContentFit='cover' 
            />
          </View>
          <View>
            <Text className={`text-white text-lg font-poppinsMedium`}>{item.item_details.item_name}</Text>
            <Text className={`text-[#AAA] text-sm font-poppinsMedium`}>@{item.item_details.place_details.place_name}</Text>
          </View>
          <View className={`flex-1 flex-row items-center justify-end`}>
            {item.user_item_rating && <Text className={`px-3 py-1 rounded-lg text-white text-xl font-poppinsMedium bg-green-600`}>{`\u2605 ${item.user_item_rating}`}</Text>}
          </View>
        </View>
        {item.user_item_review &&
          <View className={`w-full flex-row items-center`}>
            <Text className={`pl-10 pr-4 py-2 text-white text-xl font-poppinsMedium`}>{item.user_item_review}</Text>
          </View>
        }
      </View>
    );
  }, [data])

  const ListFooterComponent = () => hasMore && <Text className={`text-center text-white text-sm font-poppinsMedium`}>Loading...</Text>;

  return (
    <View className={`w-full h-full p-3`}>
      <FlashList
          data={data}
          keyExtractor={(item) => item.item_id}
          renderItem={renderItem}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
          onEndReached={() => hasMore && setPage(page+1)}
          onEndReachedThreshold={0.5}
        />
    </View>
  )
}