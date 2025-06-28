import { Stack } from "expo-router";

export default function TabsLayout() {
  return(
    <Stack initialRouteName='home' screenOptions={{ headerShown: false }} >
      <Stack.Screen name='home' options={{ animation: 'fade' }} />
      <Stack.Screen name='llm_page' />
      <Stack.Screen name='place/[id]' options={{ animation: 'ios_from_right' }} />
      <Stack.Screen name='item/[id]' options={{ animation: 'fade' }} />
      <Stack.Screen name='placeSearch' options={{ animation: 'fade'}} />
    </Stack>
  );
}