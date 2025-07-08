import { View } from 'react-native';
import { Image } from 'expo-image';
import { useCallback } from 'react';


export default function BgVideo() {
  const x = (
    <View className={`w-full absolute h-[45vh] -z-10 rounded-b-[30px]`}>
      <Image 
        source={require('../../assets/home/homeBG.gif')} 
        contentFit='cover' 
        className={`flex-1 rounded-b-[30px]`}
      />
    </View>
  )

  return useCallback(x, []);
}