import { Stack } from "expo-router";

export default function RegisterLayout() {

  return(
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' options={{ animation: 'fade' }} />
      <Stack.Screen name='signUp' options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name='profilePic' options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}