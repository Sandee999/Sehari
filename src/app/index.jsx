import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Image, ImageBackground } from 'expo-image';
import { VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';
import { useGlobalValues } from '../context/GlobalProvider';
import { BlurView } from 'expo-blur';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function LoadCss(setCssLoaded) {
  cssInterop(Image, { className: 'style' });
  cssInterop(ImageBackground, { className: 'style' });
  cssInterop(VideoView, { className: 'style' });
  cssInterop(LinearGradient, { className: 'style' });
  cssInterop(BlurView, { className: 'style' });
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

  if(error) console.log(error);
  return [fontsLoaded, error];
}

export default function Index() {
  const [cssLoaded, setCssLoaded] = useState(false);
  
  // Load Fonts
  const [fontsLoaded] = LoadFonts();

  // Load Tailwind CSS
  useEffect(() => {
    if (!cssLoaded) LoadCss(setCssLoaded);
  }, [cssLoaded]);

  // Check user status and Hide splash screen when loaded
  const { checkUser, loadUser } = useGlobalValues();
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded && cssLoaded) {
        await loadUser().then(async()=> await SplashScreen.hideAsync());
      }
    };
    hideSplashScreen();
  }, [fontsLoaded, cssLoaded]);

  return (
    <View className='w-full h-full items-center justify-center bg-black'>
      <Text className='text-white text-xl'>Loading...</Text>
    </View>
  );
}