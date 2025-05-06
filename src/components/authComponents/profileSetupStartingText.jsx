import { applicationName } from "expo-application";
import { Text, View } from "react-native";
import Animated, { useAnimatedKeyboard, useSharedValue, useAnimatedReaction, withTiming } from "react-native-reanimated";

export default function ProfileSetupStartingText() {
  const keyboard = useAnimatedKeyboard();
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  useAnimatedReaction(() => keyboard.state.value, (currentValue) => {
    if(currentValue === 1) {
      opacity.value = withTiming(0,{ duration: 300 });
      translateY.value = keyboard.height.value ? keyboard.height.value : 0;
    }
  });

  return (
    <>
      <Animated.View className={`w-full h-[50vh] absolute top-0 gap-5 items-center justify-center z-30`} style={{ opacity: opacity, transform: [{ translateY: translateY }] }}>
        <Text className={`mx-7 text-white font-lilitaOne text-8xl`}>{applicationName.toUpperCase()}</Text>
        <Text className={`mx-7 text-white font-josefinSemiBold text-3xl`}>“Before we craft your perfect food universe, tell us a little about you.”</Text>
      </Animated.View>
    </>
  );
}