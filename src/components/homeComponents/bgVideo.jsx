import { View } from 'react-native';
import { Image } from 'expo-image';


export default function BgVideo() {
  return(
    <View className={`w-full absolute h-[45vh] -z-10 rounded-b-[30px]`}>
      <Image 
        source={require('../../assets/home/homeBG.gif')} 
        contentFit='cover' 
        className={`flex-1 rounded-b-[30px]`}
      />
    </View>
  );
}