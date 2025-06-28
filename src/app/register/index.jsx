import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { applicationName } from "expo-application";
import { router } from "expo-router";
import ImageGallery from "../../components/authComponents/imageBg";

export default function OnBoarding() {
  return(
    <>
      <View className={`w-full h-full bg-black`}>
        <View className={`w-full h-[65vh] justify-center items-center`}>
          {/* App Title */}
          <Text className={`absolute z-10 text-white text-7xl font-lilitaOne`}>{applicationName.toUpperCase()}</Text>
          {/* Background */}
          <View className={`w-[100vw] h-[65vh] relative -top-20 justify-center items-center gap-8 opacity-65`}>
            <ImageGallery />
          </View>
        </View>
        <View className={`w-full h-[35vh] justify-evenly items-center`}>
          <Text adjustsFontSizeToFit numberOfLines={1} className={`h-[7vh] mx-5 text-3xl text-white font-lilitaOne`}>Every choice is a <Text className={`text-[#F4AA35]`}>Celebration</Text>.</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} className="w-full text-white text-center align-bottom text-xl font-poppinsMedium">{'⚬ your personal food universe'}</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} className="w-full text-white text-center align-bottom text-xl font-poppinsMedium">{'➤ A map of flavors, just for you'}</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} className="w-full text-white text-center align-bottom text-xl font-poppinsMedium">{'>> Skip the hype, taste the truth'}</Text>
          <TouchableOpacity
            className="w-[75vw] h-[7vh] mt-4 bg-white rounded-full items-center justify-center" 
            activeOpacity={0.85}
            onPress={() => router.replace('/register/signUp')} 
          >
            <Text className="text-2xl text-black font-poppinsSemiBold">Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar animated style='light' hidden />
    </>
  );
}