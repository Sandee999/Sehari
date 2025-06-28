import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useAnimatedKeyboard } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { ImageBackground } from "expo-image";
import ProfileSetupChatTextBox from "../../components/authComponents/profileSetupChatTextBox";
import ProfileSetupChat from "../../components/authComponents/profileSetupChat";
import ProfileSetupStartingText from "../../components/authComponents/profileSetupStartingText";

export default function SignUP() {
  const [user, setUser] = useState({
    name: '',
    DOB: '',
    taste: '',
  }); 
  const [chatData, setChatData] = useState([]);

  const keyboard = useAnimatedKeyboard();
  const animatedViewStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  useFocusEffect(useCallback(() => {
    keyboard.height.value = 0;
  }, []));

  return (
    <>
      <Animated.View className={`w-full h-full bg-black`} style={animatedViewStyles}>
        <ImageBackground source={require('../../assets/auth/bg.png')} contentFit='cover' className={`flex-1`}>
          <ProfileSetupStartingText />
          <ProfileSetupChat data={chatData} />
          <ProfileSetupChatTextBox user={user} setUser={setUser} setChatData={setChatData} />
        </ImageBackground>
      </Animated.View>
      <StatusBar animated style='light' hidden />
    </>
  );
}