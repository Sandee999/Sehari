import '../global.css';
import { useEffect } from 'react';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { UserStatus } from '../utils/constants';
import GlobalProvider, { useGlobalValues } from "../context/GlobalProvider";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function ProtectedStack() {
  const { userStatus } = useGlobalValues();  

  // Hide the splash screen once we've finished loading
  useEffect(() => {
      const hideSplashScreen = async () => {
        if (userStatus === UserStatus.IDLE || userStatus === UserStatus.LOADING) {
          await SplashScreen.hideAsync();
        }
      };
      hideSplashScreen();
    }, [userStatus]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={userStatus === UserStatus.IDLE || userStatus === UserStatus.LOADING}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={userStatus === UserStatus.NOT_LOGGED_IN}>
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={userStatus === UserStatus.NEEDS_PROFILE_COMPLETION}>
        <Stack.Screen name="register" options={{ animation: 'fade' }} />
      </Stack.Protected>
      <Stack.Protected guard={userStatus === UserStatus.LOGGED_IN}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={userStatus === UserStatus.NO_INTERNET} options={{ animation: 'fade' }}>
        <Stack.Screen name='noInternet' options={{ animation: 'fade' }} />
      </Stack.Protected>
    </Stack>
  );
}


export default function RootLayout() {
  return (
    <GlobalProvider>
      <ProtectedStack />
    </GlobalProvider>
  );
}
