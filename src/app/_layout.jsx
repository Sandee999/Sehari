import '../global.css';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import GlobalProvider from '../context/GlobalProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return(
    <GlobalProvider>
      <View className={`w-full h-full bg-black`}>
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: 'black' } }} />
          <Stack.Screen name="noInternet/[address]" />
          <Stack.Screen name="(auth)"/>
          <Stack.Screen name="(tabs)"/>
        </Stack>
      </View>
    </GlobalProvider>
  );
}
