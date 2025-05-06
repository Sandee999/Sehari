import { View } from "react-native";
import { Stack } from "expo-router";

export default function ProfilePicLayout() {
  return(
    <View style={{ flex: 1 }}>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name='profilePicCamera' options={{ animation: 'ios_from_right' }} />
        <Stack.Screen name='imageEdit' options={{ animation: 'ios_from_right' }} />
      </Stack>
    </View>
  );
}