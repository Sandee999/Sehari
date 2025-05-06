import { Stack } from "expo-router";
import { View } from "react-native";

export default function() {
  return(
    <View className={`w-full h-full`}>
      <Stack initialRouteName="index" screenOptions={{headerShown: false}}>
        <Stack.Screen name='index' options={{ animation: 'ios_from_right' }} />
        <Stack.Screen name='signUp' options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name='profilePic' />
      </Stack>
    </View>
  );
}