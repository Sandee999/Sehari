import { useEffect, useState, useRef, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, Linking, Text } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { StatusBar } from "expo-status-bar";
import { applicationName } from "expo-application";
import { Paths, File } from 'expo-file-system/next'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Camera, useCameraDevice, useCameraPermission, useMicrophonePermission } from "react-native-vision-camera";

const videoSource = require('../assets/auth/video.mp4');
const cameraCloseSource = require('../assets/camera/close.png');
const flashSources = {
  off: require('../assets/camera/flash-off.png'),
  on: require('../assets/camera/flash-on.png'),
  auto: require('../assets/camera/flash-auto.png')
}
const cameraFlipSource = require('../assets/camera/flip.png');

function Permissions({ mode, hasCameraPermission, requestCameraPermission, hasMicrophonePermission, requestMicrophonePermission }) {
  const player = useVideoPlayer(videoSource, player => {
    player.play();
    player.loop = true;
    player.volume = 0;
  });

  const camaraAccess = async () => {
    const granted = await requestCameraPermission();
    if (!granted) Linking.openSettings();
  };

  const microphoneAccess = async () => {
    const granted = await requestMicrophonePermission();
    if (!granted) Linking.openSettings();
  };

  return (
    <>
      <View className={`w-full h-full`}>
        <VideoView 
          style={StyleSheet.absoluteFill}
          player={player}
          allowsFullscreen={false} 
          allowsPictureInPicture={false} 
          contentFit='cover'
          nativeControls={false}
        />
        <View className={`w-full h-full px-5 items-start justify-center bg-[#11111199] gap-10`}>
          <Text className={`text-white text-3xl font-lilitaOne`}>App Permissions</Text>
          {!hasCameraPermission && 
          <Text className={`w-full text-white text-xl font-poppinsMedium`}>{applicationName.toUpperCase()} needs camera permissions.{' '}
            <Text onPress={camaraAccess} className={`text-blue-400 underline`}>Continue</Text>
          </Text>
          }
          {!hasMicrophonePermission && mode === 'video' && 
          <Text className={`text-white text-xl font-poppinsMedium`}>{applicationName.toUpperCase()} needs microphone permissions.{' '}
            <Text onPress={microphoneAccess} className={`text-blue-400 underline`}>Continue</Text>
          </Text>
          }
        </View>
      </View>
    </>
  );
};

export default function CameraScreen({ mode='photo', defaultFacing='back', cachefilename='image.jpg', navFunction=null }) {
  const [showCamera, setShowCamera] = useState(false);
  const camRef = useRef(null);
  const [cameraFacing, setCameraFacing] = useState(defaultFacing);
  const device = useCameraDevice(cameraFacing);
  const hasTouch = useMemo(()=>device.hasFlash || device.hasTorch, [device]);
  const [flash, setFlash] = useState('auto');
  
  // Permissions
  const { hasPermission: hasCameraPermission, requestPermission : requestCameraPermission } = useCameraPermission();
  const { hasPermission: hasMicrophonePermission, requestPermission : requestMicrophonePermission } = useMicrophonePermission();
  useEffect(()=>{
    if(mode==='photo') setShowCamera(hasCameraPermission);
    else setShowCamera(hasCameraPermission && hasMicrophonePermission);
  },[hasCameraPermission, hasMicrophonePermission, mode]);

  const takePhoto = async () => {
    const photo = await camRef.current.takePhoto({
      flash: flash,
      skipMetadata: true,
      enableShutterSound: true,
      enableAutoDistortionCorrection: true,
    });
  
    console.log('Photo: ', photo.path);
  
    const tempFile = new File(photo.path);
    const destFile = new File(Paths.cache, cachefilename);
  
    if (destFile.exists) {
      destFile.delete(); // Clean up the old one
    }
    tempFile.move(destFile); // Replace with the new photo
    if(navFunction) navFunction();
    else router.back();

  };

  if(!showCamera) {
    return <Permissions 
      mode={mode} 
      hasCameraPermission={hasCameraPermission} 
      hasMicrophonePermission={hasMicrophonePermission} 
      requestCameraPermission={requestCameraPermission} 
      requestMicrophonePermission={requestMicrophonePermission} 
    />
  }

  return(
    <GestureHandlerRootView style={{flex: 1}}>
      <View className={`w-full h-full items-center justify-center`}>
        <Camera
          ref={camRef}
          style={{width: '100%', height: '100%'}}
          resizeMode='contain'
          device={device}
          torch={flash === 'on' ? 'on' : 'off'}
          isActive={true}
          photo={true}
          photoHdr={true}
          video={true}
          focusable={true}
          photoQualityBalance='balanced'
          preview={true}
          enableZoomGesture={true}
        />
        <View className={`w-full h-full absolute top-0 items-center`}>
          {/* Close Button */}
          <TouchableOpacity activeOpacity={0.5} className={`w-8 h-8 absolute top-14 right-4`} onPress={() => router.back()}>
            <Image source={cameraCloseSource} contentFit='cover' className={`flex-1`} tintColor={'white'} />
          </TouchableOpacity>
          {/* Bottom Section */}
          <View className={`absolute bottom-16 w-full flex-row items-center justify-evenly`}>
            <View className={`w-12 h-12 p-2`}>
            {hasTouch && 
              <TouchableOpacity activeOpacity={0.5} className={`flex-1`} onPress={() => setFlash(flash === 'off' ? 'auto' : flash === 'auto' ? 'on' : 'off')} >
                <Image source={flashSources[flash]} tintColor={flash === 'off' ? 'white' : '#F4AA35'} className={`flex-1`} />
              </TouchableOpacity>
            }
            </View>
            <TouchableOpacity activeOpacity={0.85} className={`w-20 h-20 rounded-full bg-white`} onPress={takePhoto}>
              <View className={`m-1 flex-1 rounded-full border-4`} />
            </TouchableOpacity>
            <View className={`w-12 h-12 p-2`} >
              <TouchableOpacity activeOpacity={0.5} className={`flex-1`} onPress={() => setCameraFacing(cameraFacing === 'front' ? 'back' : 'front')} >
                <Image source={cameraFlipSource} tintColor={'white'} className={`flex-1`} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <StatusBar style="dark" backgroundColor="white" hidden />
    </GestureHandlerRootView>
  );
}