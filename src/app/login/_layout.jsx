import { Stack } from "expo-router";

export default function LoginLayout() {

  return(
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="verify" options={{ animation: 'ios_from_right' }} />
      </Stack>
    </>
  );
}