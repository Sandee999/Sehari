import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import * as Application from 'expo-application';
import PhoneEntry from '../../../components/authComponents/phoneEntry';
import { Link } from 'expo-router';

const videoSource = require('../../../assets/auth/login.mp4');

export default function Index() {
  const player = useVideoPlayer(videoSource, player => {
    player.play();
    player.loop = true;
    player.volume = 0;
  });

  return (
    <>
      <View className='w-full h-full flew-1 -z-20 items-center bg-black'>
        {/* Top Section */}
        <View className={`w-full h-[80vh] z-0`} >
          {/* Video Display */}
          <VideoView 
            className={`w-full h-full z-0 rounded-b-[30px]`}
            player={player}
            allowsFullscreen={false} 
            allowsPictureInPicture={false} 
            contentFit='cover'
            nativeControls={false}
          />
          {/* On Top of Video */}
          <View className={`w-full h-full justify-between bg-[#00000099] absolute top-0 z-10`} >
            <View className='w-full h-[40vh] items-center justify-center z-20'>
              <Text className='text-7xl text-white font-lilitaOne'>{Application.applicationName.toUpperCase()}</Text>
              <Text className='text-lg text-white font-lilitaOne relative -top-2'>Every choice is a celebration</Text>
            </View>
            <PhoneEntry />
          </View>
        </View>
        {/* Bottom Section */}
        <View className={`w-full h-[20vh] pb-5 justify-between items-center`}>
          <View className={`flex flex-row items-center justify-center gap-3`}>
            <View className={`bg-white h-[1px] w-[35vw]`} />
            <Text className={`text-white font-poppinsSemiBold`}>OR</Text>
            <View className={`bg-white h-[1px] w-[35vw]`} />
          </View>
          <TouchableOpacity activeOpacity={.9} onPress={()=>Alert.alert("Under Dev", "This Feature is corrently under development")} className={`p-3 bg-[#fff] flex-row rounded-full my-2 items-center justify-evenly`}>
            <Image source={require('../../../assets/auth/google.png')} contentFit='contain' className={`w-[9vw] h-[4vh]`} />
          </TouchableOpacity>
          <View className={`flex items-center justify-center mb-5`}>
            <Text className={`text-white font-poppinsMedium text-sm`}>By continuing, you agree to our</Text>
            <Link href={'https://www.google.com/search?q=terms+and+conditions'}>
              <Text className={`text-white font-poppinsMedium text-sm underline`}>Terms of Service and Privacy Policy</Text>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}