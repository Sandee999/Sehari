import { Stack } from "expo-router";
import { View } from "react-native";

export default function() {
  return(
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login'/>
        <Stack.Screen name='register'/>
      </Stack>
    </View>
  );
}