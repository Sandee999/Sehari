import { Stack } from "expo-router";
import { useGlobalValues } from "../../context/GlobalProvider";

export default function TabsLayout() {
  const { userData: { isCreator } } = useGlobalValues();

  return(
    <Stack initialRouteName='home' screenOptions={{ headerShown: false }} >
      <Stack.Screen name='home' options={{ animation: 'default', presentation: 'transparentModal' }} />
      <Stack.Screen name='llm_page' />
      <Stack.Screen name='place/[id]' options={{ animation: 'ios_from_right', presentation: 'transparentModal' }} />
      <Stack.Screen name='item/[id]' options={{ animation: 'ios_from_right', presentation: 'transparentModal' }} />
      <Stack.Screen name='placeSearch' options={{ animation: 'ios_from_right' , presentation: 'transparentModal' }} />
      <Stack.Screen name='profile/[id]' options={{ animation: 'slide_from_right', presentation: 'transparentModal' }} />
      <Stack.Protected guard={isCreator}>
        <Stack.Screen name='creatorAddPlace/[id]' options={{ animation: 'ios_from_right', presentation: 'transparentModal' }} />
        <Stack.Screen name='creatorAddItem/[id]' options={{ animation: 'ios_from_right', presentation: 'transparentModal' }} />
        <Stack.Screen name='creatorAddPlaceImage/[id]' options={{ animation: 'ios_from_right', presentation: 'transparentModal' }} />
        <Stack.Screen name='creatorAddItemImage/[id]' options={{ animation: 'ios_from_right', presentation: 'transparentModal' }} />
      </Stack.Protected>
    </Stack>
  );
}