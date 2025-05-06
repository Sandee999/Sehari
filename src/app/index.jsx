import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect } from 'expo-router';
import { Image, ImageBackground } from 'expo-image';
import { VideoView } from 'expo-video';
import { Camera } from 'react-native-vision-camera';
import { cssInterop } from 'nativewind';
import { useGlobalValues } from '../context/GlobalProvider';
import checkUser from '../utils/checkUser';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function LoadCss(setCssLoaded) {
  cssInterop(Image, { className: 'style' });
  cssInterop(ImageBackground, { className: 'style' });
  cssInterop(VideoView, { className: 'style' });
  cssInterop(Camera, { className: 'style' });
  setCssLoaded(true);
}

function LoadFonts() {
  const [fontsLoaded, error] = useFonts({
    // Poppins Fonts
    "Poppins-Black": require("../assets/fonts/poppins/Poppins-Black.ttf"),
    "Poppins-BlackItalic": require("../assets/fonts/poppins/Poppins-BlackItalic.ttf"),
    "Poppins-Bold": require("../assets/fonts/poppins/Poppins-Bold.ttf"),
    "Poppins-BoldItalic": require("../assets/fonts/poppins/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/poppins/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraBoldItalic": require("../assets/fonts/poppins/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/poppins/Poppins-ExtraLight.ttf"),
    "Poppins-ExtraLightItalic": require("../assets/fonts/poppins/Poppins-ExtraLightItalic.ttf"),
    "Poppins-Italic": require("../assets/fonts/poppins/Poppins-Italic.ttf"),
    "Poppins-Light": require("../assets/fonts/poppins/Poppins-Light.ttf"),
    "Poppins-LightItalic": require("../assets/fonts/poppins/Poppins-LightItalic.ttf"),
    "Poppins-Medium": require("../assets/fonts/poppins/Poppins-Medium.ttf"),
    "Poppins-MediumItalic": require("../assets/fonts/poppins/Poppins-MediumItalic.ttf"),
    "Poppins-Regular": require("../assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/poppins/Poppins-SemiBold.ttf"),
    "Poppins-SemiBoldItalic": require("../assets/fonts/poppins/Poppins-SemiBoldItalic.ttf"),
    "Poppins-Thin": require("../assets/fonts/poppins/Poppins-Thin.ttf"),
    "Poppins-ThinItalic": require("../assets/fonts/poppins/Poppins-ThinItalic.ttf"),
  
    // Josefin Sans Fonts
    "JosefinSans-Bold": require("../assets/fonts/josefinSans/JosefinSans-Bold.ttf"),
    "JosefinSans-BoldItalic": require("../assets/fonts/josefinSans/JosefinSans-BoldItalic.ttf"),
    "JosefinSans-ExtraLight": require("../assets/fonts/josefinSans/JosefinSans-ExtraLight.ttf"),
    "JosefinSans-ExtraLightItalic": require("../assets/fonts/josefinSans/JosefinSans-ExtraLightItalic.ttf"),
    "JosefinSans-Italic": require("../assets/fonts/josefinSans/JosefinSans-Italic.ttf"),
    "JosefinSans-Light": require("../assets/fonts/josefinSans/JosefinSans-Light.ttf"),
    "JosefinSans-LightItalic": require("../assets/fonts/josefinSans/JosefinSans-LightItalic.ttf"),
    "JosefinSans-Medium": require("../assets/fonts/josefinSans/JosefinSans-Medium.ttf"),
    "JosefinSans-MediumItalic": require("../assets/fonts/josefinSans/JosefinSans-MediumItalic.ttf"),
    "JosefinSans-Regular": require("../assets/fonts/josefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-SemiBold": require("../assets/fonts/josefinSans/JosefinSans-SemiBold.ttf"),
    "JosefinSans-SemiBoldItalic": require("../assets/fonts/josefinSans/JosefinSans-SemiBoldItalic.ttf"),
    "JosefinSans-Thin": require("../assets/fonts/josefinSans/JosefinSans-Thin.ttf"),
    "JosefinSans-ThinItalic": require("../assets/fonts/josefinSans/JosefinSans-ThinItalic.ttf"),

    // Lilita One Fonts
    "LilitaOne-Regular": require("../assets/fonts/lilitaOne/LilitaOne-Regular.ttf"),
  });

  return [fontsLoaded, error];
}

// async function checkUser(loadUser, setRedirect) {
//   const { data, error } = await loadUser();
//   if(error && (error?.name === 'AuthSessionMissingError' || error?.name === 'AuthApiError') ){
//     setRedirect('/login');
//     return;
//   }
//   else if(error && error?.code==='PGRST116'){
//     setRedirect('/register');
//     return;
//   }
//   else if(!data) {
//     setRedirect('/noInternet/root');
//     return;
//   }else {
//     const hasNull = Object.values(data).some((value) => value === null);
//     if (hasNull) {
//       setRedirect('/register');
//       return;
//     }
//     setRedirect('/home');
//   }
// }

export default function Index() {
  const [redirect, setRedirect] = useState(null);
  const [cssLoaded, setCssLoaded] = useState(false);
  
  // Load Fonts
  const [fontsLoaded] = LoadFonts();

  // Load Tailwind CSS
  useEffect(() => {
    if (!cssLoaded) LoadCss(setCssLoaded);
  }, [cssLoaded]);

  // Check user authentication status
  const { loadUser } = useGlobalValues();
  useEffect(() => {
    if (!redirect) {
      const check = async() => {
        await checkUser(loadUser).then((value) => setRedirect(value));
      };
      check();
    };
  }, [redirect]);

  // Hide splash screen when loaded
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded && cssLoaded && redirect) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplashScreen();
  }, [fontsLoaded, cssLoaded, redirect]);

  if (!fontsLoaded || !cssLoaded || !redirect) null;
  else return <Redirect href={redirect} />;
}