import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermissions, useMicrophonePermissions, CameraView, Camera } from 'expo-camera';
import { useEventListener } from 'expo';
import { applicationName } from 'expo-application';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import cacheFile from '../utils/cacheFiles';

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

  useEventListener(player, 'playingChange', ({ isPlaying }) => {
    if(!isPlaying)  player.play();
  });

  const camaraAccess = async () => {
    const response = await requestCameraPermission();
    if (!response.granted) Linking.openSettings();
  };

  const microphoneAccess = async () => {
    const response = await requestMicrophonePermission();
    if (!response.granted) Linking.openSettings();
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
}

export default function CameraScreen({ mode = 'picture', ratio='4:3', defaultFacing='back', cachefilename='image.jpg', navFunction=null }) {
  const [showCamera, setShowCamera] = useState(false);
  const camRef = useRef(null);
  const [cameraFacing, setCameraFacing] = useState(defaultFacing);
  const [flash, setFlash] = useState('auto');
  const [camPictureSize, setPictureSize] = useState(null);

  const [cameraStatus, requestCameraPermission] = useCameraPermissions();
  const [microphoneStatus, requestMicrophonePermission] = useMicrophonePermissions();
  useEffect(()=>{
    if(mode='picture') setShowCamera(cameraStatus?.granted);
    else setShowCamera(cameraStatus?.granted, microphoneStatus?.granted)
  },[cameraStatus, microphoneStatus, requestCameraPermission, requestMicrophonePermission]);

  useEffect(()=>{
    const get = async() =>{
      await camRef.current?.getAvailablePictureSizesAsync().then(sizes => setPictureSize(sizes[0]));
    }
    get();
  },[]);

  const takePhoto = async() =>{
    const photo = await camRef.current?.takePictureAsync({
      imageType: 'jpg',
      shutterSound: true,
      skipProcessing: false
    });

    await cacheFile(photo.uri, cachefilename);
    if(navFunction) navFunction();
    else router.back();
  }

  if(!showCamera){
    return <Permissions 
      mode={mode} 
      hasCameraPermission={cameraStatus?.granted} 
      hasMicrophonePermission={microphoneStatus?.granted} 
      requestCameraPermission={requestCameraPermission} 
      requestMicrophonePermission={requestMicrophonePermission} 
    />;
  }

  return (
    <>
      <SafeAreaView className={`flex-1 bg-black`}>
        <CameraView 
          style={StyleSheet.absoluteFillObject}
          ref={camRef}
          autofocus={true}
          animateShutter={true}
          mode={mode}
          ratio={ratio}
          pictureSize={camPictureSize}
          facing={cameraFacing}
          enableTorch={flash==='on'}
          flash={flash}
        />
        <View className={`w-full h-full absolute top-0 items-center`}>
          {/* Close Button */}
          <TouchableOpacity activeOpacity={0.5} className={`w-8 h-8 absolute top-14 right-4`} onPress={() => router.back()}>
            <Image source={cameraCloseSource} contentFit='cover' className={`flex-1`} tintColor={'white'} />
          </TouchableOpacity>
          {/* Bottom Section */}
          <View className={`absolute bottom-0 w-full flex-row items-center justify-evenly`}>
            <View className={`w-12 h-12 p-2`}>
            { 
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
      </SafeAreaView>
      <StatusBar style='light' hidden={false} />
    </>
  );
}