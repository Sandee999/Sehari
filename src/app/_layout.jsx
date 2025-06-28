import '../global.css';
import GlobalProvider, { useGlobalValues } from "../context/GlobalProvider";
import { Stack } from "expo-router";
import { UserStatus } from '../utils/constants';

function ProtectedStack() {
  const { userStatus, userData } = useGlobalValues();  
  // console.log('USER STATUS: ', userStatus);
  // console.log('USER DATA: ', userData);

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
