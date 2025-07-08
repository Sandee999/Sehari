import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Keyboard } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { useAnimatedKeyboard, useAnimatedStyle, useSharedValue, useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { getItemDetailsById } from '../../../service/food';
import { Image } from 'expo-image';
import { wkbToCoords } from '../../../utils/location/wkb-coordinates';
import { getItemRatingAndReview, setUserReview } from '../../../service/userData';
import { FlashList } from '@shopify/flash-list';
import ProfilePicView from '../../../components/ProfilePicView';
import { useGlobalValues } from '../../../context/GlobalProvider';
import RatingModel from '../../../components/itemComponents/RatingModel';

function shareItem(item_id){
  Sharing.shareAsync(`sehari://item/${item_id}`);
}

export default function Item() {
  const { id } = useLocalSearchParams();
  const [ itemDetails, setItemDetails ] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const { userData } = useGlobalValues();

  useEffect(()=>{
    const get = async() =>{
      const item = await getItemDetailsById(id);
      setItemDetails(item);
    }
    get();
  },[]);

  // For Location
  useEffect(()=>{
    if(!itemDetails) return;
    if(!itemDetails.place_location) return;
    const coords = wkbToCoords(itemDetails.place_location);
    setCoordinates(coords);
  }, [itemDetails]);

  // For Reviews
  const [reviews, setReviews] = useState([]);
  useEffect(()=>console.log(reviews),[reviews]);
  const limit = 10;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  useEffect(()=>{
    const get = async() =>{
      const data = await getItemRatingAndReview(id, page*limit, (page+1)*limit-1);
      if(data.length < limit) setHasMore(false);
      setReviews((prev) => {
        const combined = [...prev, ...data];
        const unique = Array.from(new Map(combined.map(item => [item.user_id, item])).values());
        return unique;
      });
    }
    get();
  },[page]);

  const Reviews = useCallback(({reviews})=>{
    const renderItem = ({ item }) => (
      <View className={`w-full flex-1 px-3 py-2 bg-[#222] border-[1px] border-[#AAA] rounded-lg`}>
        <View className={`w-full gap-2 flex-row items-center`}>
          <View className={`w-[40px] h-[40px] rounded-full overflow-hidden`}>
            <ProfilePicView userId={item.user_id} margin={0} />
          </View>
          <View>
            <Text className={`text-white text-lg font-poppinsMedium`}>{item.name}</Text>
            <Text className={`text-[#AAA] text-sm font-poppinsMedium`}>@{item.username}</Text>
          </View>
          <View className={`flex-1 flex-row items-center justify-end`}>
            {item.rating && <Text className={`px-3 py-1 rounded-lg text-white text-xl font-poppinsMedium bg-green-600`}>{`\u2605 ${item.rating}`}</Text>}
          </View>
        </View>
        <View className={`w-full flex-row items-center`}>
          <Text className={`pl-10 pr-4 py-2 text-white text-xl font-poppinsMedium`}>{item?.review}</Text>
        </View>
      </View>
    );

    const ListFooterComponent = useMemo(()=>{
      return (
        <View className={`w-full h-[50px] flex-row items-center justify-center`}>
          {hasMore && 
            <>
              <Text className={`text-white text-lg font-poppinsMedium`}>Loading more </Text>
              <ActivityIndicator size='small' color='white' />
            </>
          }
        </View>
      );
    },[hasMore]);

    return(
      <View className={`w-full flex-1 px-4 py-2`}>
        <FlashList
          data={reviews}
          keyExtractor={(item, index) => item.user_id}
          renderItem={renderItem}
          estimatedItemSize={100}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={ListFooterComponent}
          onEndReached={() => hasMore && setPage(page+1)}
          onEndReachedThreshold={0.5}
        />
      </View>
    )
  },[reviews]);

  // For Keyboard 
  const keyboard = useAnimatedKeyboard();
  const animatedViewStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));
  const opacity = useSharedValue(1);
  useAnimatedReaction(()=>keyboard, (currentValue)=>{
    if(currentValue.height.value === 0) opacity.value = withTiming(1,{ duration: 300 });
    else opacity.value = withTiming(0.45,{ duration: 300 });
  });

  // For Review Writing
  const [text, setText] =useState('')
  async function onReviewSubmit() {
    if(text.split('').length<=0){
      console.warn('No Text Entered');
      return;
    }

    const { data, error } = await setUserReview(userData.id, id, text);
    if(error){
      Alert.alert('Error', 'Failed to submit the review.');
      return;
    }
    setText('');
    Keyboard.dismiss();

    setReviews(prev => {
      const updated = prev.filter(item => item.user_id !== userData.id);
      return [data, ...updated];
    });
  }

  // For Review
  const [showRating, setShowRating] = useState(false);
  const toggleReview = () => {
    setShowRating(prev => !prev);
  }

  return (
    <>
      <SafeAreaView className='w-full h-full bg-black'>
        <Animated.ScrollView style={{ opacity: opacity }} className='w-full flex-grow-[1] z-0'>
          <Image 
            source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/items/${id}/itemPic.jpg` }} 
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
            <TouchableOpacity activeOpacity={0.7} onPress={()=>shareItem(id)} className={`px-2 py-1 gap-2 flex-row items-center bg-[#AAAAAA33] border-[1px] border-white rounded-xl `}>
              <Image source={require('../../../assets/home/share.png')} contentFit='contain' className={`w-[19px] h-[20px]`} />
              <Text className={`align-middle text-white font-poppinsRegular text-lg`}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={toggleReview} className={`px-2 py-1 gap-2 flex-row items-center bg-[#AAAAAA33] border-[1px] border-white rounded-xl `}>
              <Text className={`align-middle text-white font-poppinsRegular text-lg`}>Give a Rating</Text>
            </TouchableOpacity>
          </View>
          <View className={`w-full h-[1px] bg-[#C5C4C4] opacity-20`} />
          <View className={`w-full flex-1 mt-5`}>
            <Text className={`w-[100vw] px-4 text-white font-lilitaOne text-3xl`}>User Reviews</Text>
            <View className={`flex-grow-[1] justify-center items-center`}>
              {(reviews && reviews.length>0) ?
                <Reviews reviews={reviews}/>
                :
                <Text className={`py-20 px-4 text-[#C5C4C4CC] font-poppinsRegular text-base`}>No reviews yet</Text>
              }
            </View>
          </View>
        </Animated.ScrollView>
          <Animated.View style={animatedViewStyles} className={`w-full min-h-[80px] z-20 flex-row items-center justify-evenly`}>
            <View className={`w-[85vw] flex-row border-[1px] border-white rounded-3xl bg-black`}>
              <TextInput
                placeholder='Write a review...' 
                placeholderTextColor='white' 
                value={text}
                onChangeText={setText}
                multiline={true}
                textAlignVertical='bottom'
                className={`flex-1 p-4 pt-5 text-white font-poppinsRegular text-base`}
              />
              <TouchableOpacity activeOpacity={0.8} onPress={onReviewSubmit} className={`w-[45px] h-[45px] p-3 pt-4`}>
                <Image source={require('../../../assets/home/send.png')} tintColor={'#FFFFFF'} contentFit='contain' className={`w-full h-full`} />
              </TouchableOpacity>
            </View>
          </Animated.View>
      </SafeAreaView>
      <StatusBar animated style='light' hidden={false} />
      <RatingModel modelVisible={showRating} toggleModelVisible={toggleReview} user_id={userData.id} item_id={id} setReviews={setReviews} />
    </>
  )
}