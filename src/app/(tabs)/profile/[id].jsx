import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ReduceMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGlobalValues } from '../../../context/GlobalProvider'
import { getProfile } from '../../../service/profile';
import { Image } from 'expo-image';

export default function Profile() {
  const { id } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const { userData } = useGlobalValues();
  const isUser = id === userData.id;
  const [data, setData] = useState(null);

  useEffect(()=>console.log(data),[data]);
  
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  const mainRotate = useSharedValue('0deg');
  const onMainPress = () => {
    const x = mainRotate.value === '0deg' ? '45deg' : '0deg';
    mainRotate.value = withSpring(x, {
      duration: 1000,
      dampingRatio: 0.4,
      stiffness: 500,
      overshootClamping: true,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 150,
      reduceMotion: ReduceMotion.Never,
    });
  };

  useEffect(() => {
    if(isUser) setData(userData);
    else {
      const get = async() => {
        const data = await getProfile(id);
        setData(data);
      }
      get();
    }
  },[]);

  return (
    <>
      <ScrollView className='w-full h-full bg-black' style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className='w-full h-[50px] flex-row mx-6 gap-6 items-center'>
          <TouchableOpacity >
            <Image source={require('../../../assets/home/backArrow.png')} contentFit='contain' className='w-[20px] h-[20px]' />
          </TouchableOpacity>
          <Text className='text-xl text-white font-poppinsMedium'>Profile</Text>
        </View>
        <View className='w-full h-[120px] flex-row'>
          <View className='w-[120px] h-full ml-5 items-center justify-center'>
            <Image 
              source={{ uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/profiles/${data?.id}/profilePic.jpg`}} 
              contentFit='cover'
              className='w-[80px] h-[80px] rounded-full bg-[#3C3C3C]'
            />
          </View>
          <View className='flex-1 items justify-center'>
            <Text className='text-2xl font-poppinsMedium text-white'>{data?.name}</Text>
            <Text className='text-base font-poppinsMedium text-[#D9D9D9]'>@{data?.username}</Text>
          </View>
        </View>
        <View className='w-full h-[50px] flex-row mx-6 gap-6 items-center'>
          <Text className='text-lg text-white font-poppinsMedium'>Posts</Text>
          <Text className='text-lg text-white font-poppinsMedium'>Followers</Text>
          <Text className='text-lg text-white font-poppinsMedium'>Following</Text>
        </View>
        <View className='w-full h-[1px] bg-[#D9D9D9] opacity-10' />
        <View className='w-full mt-4 flex-row justify-evenly'>
          <Text className='text-lg text-white font-poppinsMedium mx-6'>About</Text>
          <Text className='text-xl underline text-white font-poppinsMedium'>Reviews</Text>
        </View>
        <View className='w-full flex-1'>
          
        </View>
      </ScrollView>
      {isUser &&
      <AnimatedTouchableOpacity 
        onPress={onMainPress} 
        activeOpacity={0.85} 
        style={{ transform: [{ rotate: mainRotate }] }} 
        className={`w-14 h-14 absolute bottom-16 right-5 z-10 justify-center items-center rounded-full bg-black border-2 border-white`}
      >
        <Text className='text-5xl text-white font-poppinsLight'>+</Text>
      </AnimatedTouchableOpacity>

      }
      <StatusBar style='light' hidden={false} />
    </>
  )
}