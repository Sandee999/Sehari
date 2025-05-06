import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Image, useImage } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Paths, File } from 'expo-file-system/next';
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedRef, runOnUI, runOnJS, measure, useAnimatedReaction } from "react-native-reanimated";
import * as ImageManipulator from "expo-image-manipulator";
import LoadingMadal from "./loadingModal"
import { StatusBar } from "expo-status-bar";

const cornerStyle = (vertical, horizontal) => ({
  position: 'absolute',
  width: 10,
  height: 10,
  borderColor: '#FFFFFF',
  ...(vertical === 'top' ? { top: 0, borderTopWidth: 2 } : { bottom: 0, borderBottomWidth: 2 }),
  ...(horizontal === 'left' ? { left: 0, borderLeftWidth: 2 } : { right: 0, borderRightWidth: 2 }),
});


export default function ImageEditor({ cacheFileName, saveToCacheFileName }) {
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(new File(Paths.cache, cacheFileName).uri+`?t=${Date.now()}`);
  const imageRef = useImage(useMemo(()=>new File(Paths.cache, cacheFileName).uri+`?t=${Date.now()}`, [cacheFileName]));
  const imageContext = ImageManipulator.useImageManipulator(imageUri);

  // Pan View
  const PanView = Animated.createAnimatedComponent(View);
  const deviceDimensions = useWindowDimensions();
  const panDimensionsWidth = useSharedValue(0);
  const panDimensionsHeight = useSharedValue(0);

  const panViewStyle = useAnimatedStyle(() => ({
    width: panDimensionsWidth.value,
    height: panDimensionsHeight.value,
  }), []);

  useEffect(()=>{
    if(!imageRef) return;
    const imageRatio = imageRef.width/imageRef.height;
    const deviceRatio = deviceDimensions.width/deviceDimensions.height;
    
    if(imageRatio>deviceRatio){
      // Width Fit 
      const panWidth = deviceDimensions.width;
      const panHeight = deviceDimensions.width/imageRatio;
      panDimensionsWidth.value = panWidth;
      panDimensionsHeight.value = panHeight;
    }
    else{
      // Height Fit
      const panWidth = deviceDimensions.height*imageRatio;
      const panHeight = deviceDimensions.height;
      panDimensionsWidth.value = panWidth;
      panDimensionsHeight.value = panHeight;
    }
  },[imageRef]);

  // Animation for crop
  const CropView = Animated.createAnimatedComponent(View);
  const cropViewRef = useAnimatedRef(null);

  const cropViewTop = useSharedValue(null);
  const cropViewBottom = useSharedValue(null);
  const cropViewLeft = useSharedValue(null);
  const cropViewRight = useSharedValue(null);
  const cropViewWidth = useSharedValue(null);
  const cropViewHeight = useSharedValue(null);

  const cropViewx = useSharedValue(0);
  const cropViewy = useSharedValue(0);

  // Update Crop View
  useAnimatedReaction(() => [panDimensionsWidth.value, panDimensionsHeight.value], (current) => {
      cropViewTop.value = cropViewBottom.value = cropViewLeft.value = cropViewRight.value = null;
      cropViewWidth.value = cropViewHeight.value = Math.min(...current);
  });

  const cropViewStyle = useAnimatedStyle(() => ({
    top: cropViewTop.value,
    bottom: cropViewBottom.value,
    left: cropViewLeft.value,
    right: cropViewRight.value,
    width: cropViewWidth.value,
    height: cropViewHeight.value,
    transform: [{ translateX: cropViewx.value }, { translateY: cropViewy.value }]
  }));

  const [showMove, setShowMove] = useState(false);
  useAnimatedReaction(() => [cropViewTop.value, cropViewLeft.value], (values) => {
    if(values[0] !== null && values[1] !== null) {
      runOnJS(setShowMove)(true);
    }
  });

  function measureBoxAsync() {
    return new Promise((resolve) => {
      runOnUI(() => {
        const layout = measure(cropViewRef);
        if (layout) {
          runOnJS(resolve)(layout);
        }
      })();
    });
  };

  // Pan Gesture for crop
  const initalx = useSharedValue(null);
  const initaly = useSharedValue(null);
  const outerGesture = Gesture.Pan()
  .runOnJS(true)
  .onStart((e) => {
    'worklet';
    initalx.value = e.x;
    initaly.value = e.y;
  })
  .onUpdate((e) => {
    'worklet';
    let xlength, ylength; 
    const length = Math.max(Math.abs(e.translationX),  Math.abs(e.translationY));
    if(e.translationX>0){
      cropViewRight.value = null;
      cropViewLeft.value = initalx.value;
      xlength = panDimensionsWidth.value - cropViewLeft.value;
    }
    else {
      cropViewLeft.value = null;
      cropViewRight.value = panDimensionsWidth.value - initalx.value;
      xlength = panDimensionsWidth.value - cropViewRight.value;
    }
    if(e.translationY>0){
      cropViewBottom.value = null;
      cropViewTop.value = initaly.value;
      ylength = panDimensionsHeight.value - cropViewTop.value;
    }
    else {
      cropViewTop.value = null;
      cropViewBottom.value = panDimensionsHeight.value - initaly.value;
      ylength = panDimensionsHeight.value - cropViewBottom.value;
    }
    cropViewWidth.value = cropViewHeight.value = Math.min(length, xlength, ylength);
  })
  .onEnd(() => {
    'worklet';
    if(cropViewBottom.value!==null) {
      cropViewTop.value = panDimensionsHeight.value - (cropViewBottom.value + cropViewHeight.value);
      cropViewBottom.value = null;
    }
    if(cropViewRight.value!==null) {
      cropViewLeft.value = panDimensionsWidth.value - (cropViewRight.value + cropViewWidth.value);
      cropViewRight.value = null;
    }
  });

  // Pan Gesture for moving crop
  const innerGesture =useMemo(() => Gesture.Pan()
  .runOnJS(true)
  .onUpdate((e) => {
    'worklet';
    const { translationX, translationY } = e;

    // Handle horizontal movement
    const newLeft = cropViewLeft.value + translationX;
    if (newLeft >= 0 && (newLeft + cropViewWidth.value) <= panDimensionsWidth.value) {
      cropViewx.value = translationX;
    }

    // Handle vertical movement
    const newTop = cropViewTop.value + translationY;
    if (newTop >= 0 && (newTop + cropViewHeight.value) <= panDimensionsHeight.value) {
      cropViewy.value = translationY;
    }

  })
  .onEnd(() => {
    'worklet';
    cropViewTop.value = cropViewTop.value + cropViewy.value;
    cropViewLeft.value = cropViewLeft.value + cropViewx.value;

    // Reset gesture deltas
    cropViewx.value = cropViewy.value = 0;
  }));
  
  // Button Action
  const onHorizontalFlip = async() => {
    setLoading(true);
    imageContext.flip(ImageManipulator.FlipType.Horizontal);
    const image = await imageContext.renderAsync();
    const result = await image.saveAsync();
    setImageUri(result.uri);
    setLoading(false);
  }

  const onVerticalFlip = async() => {
    setLoading(true);
    imageContext.flip(ImageManipulator.FlipType.Vertical);
    const image = await imageContext.renderAsync();
    const result = await image.saveAsync();
    setImageUri(result.uri);
    setLoading(false);
  }
  
  const onRotate = async () => {
    setLoading(true);
    imageContext.rotate(90);
    const image = await imageContext.renderAsync();
    const result = await image.saveAsync();
    setImageUri(result.uri);
    
    runOnUI(() => {
      // Swap the values
      [panDimensionsWidth.value, panDimensionsHeight.value] = [panDimensionsHeight.value, panDimensionsWidth.value];

      // Update Pan View
      const imageRatio = panDimensionsWidth.value/panDimensionsHeight.value;
      const deviceRatio = deviceDimensions.width/deviceDimensions.height;
      
      if(imageRatio>deviceRatio){
        // Width Fit 
        const panWidth = deviceDimensions.width;
        const panHeight = deviceDimensions.width/imageRatio;
        panDimensionsWidth.value = panWidth;
        panDimensionsHeight.value = panHeight;
      }
      else{
        // Height Fit
        const panWidth = deviceDimensions.height*imageRatio;
        const panHeight = deviceDimensions.height;
        panDimensionsWidth.value = panWidth;
        panDimensionsHeight.value = panHeight;
      }
    })();
    
    setShowMove(false);
    setLoading(false);
  }
  
  const onDone = async () => {
    setLoading(true);
    setTimeout(async () => {
      const layout = await measureBoxAsync();
      let cropDimensions = { originX: 0, originY: 0, width: 0, height: 0 };
      // calculate cropDimensions
      {
        cropDimensions.originX = layout.x * imageRef.width / panDimensionsWidth.value;
        cropDimensions.originY = layout.y * imageRef.height / panDimensionsHeight.value;
        cropDimensions.width = layout.width * imageRef.width / panDimensionsWidth.value;
        cropDimensions.height = layout.height * imageRef.height / panDimensionsHeight.value;
      }
      console.log(cropDimensions);
      imageContext.crop(cropDimensions);
      const image = await imageContext.renderAsync();
      const result = await image.saveAsync({
        format: ImageManipulator.SaveFormat.JPEG,
      });
      const tempFile = new File(result.uri);
      const destFile = new File(Paths.cache, saveToCacheFileName);
      if (destFile.exists) {
        destFile.delete(); // Clean up the old one
      }
      tempFile.move(destFile); // Replace with the new photo

      router.back();
      setLoading(false);
    }, 100); // Adjust the delay as necessary
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="w-full h-full bg-black items-center justify-center">
        {/* Image */}
        <View className="w-full h-full">
          <Image source={{ uri: imageUri }} contentFit="contain" className="flex-1" />
        </View>
        {/* Pan */}
        <GestureDetector gesture={outerGesture}>
          <PanView className="absolute items-center justify-center" style={[panViewStyle]}>
            <CropView className="absolute justify-center items-center" style={[cropViewStyle]} ref={cropViewRef}>
              {/* Top Left Corner */}
              <View style={cornerStyle('top', 'left')} />
              {/* Top Right Corner */}
              <View style={cornerStyle('top', 'right')} />
              {/* Bottom Left Corner */}
              <View style={cornerStyle('bottom', 'left')} />
              {/* Bottom Right Corner */}
              <View style={cornerStyle('bottom', 'right')} />
              {/* Full */}
              <View className={`w-full h-full border-[1px] border-dashed border-white -z-10`} />
              {/* Move Gesture */}
              {showMove &&
                <GestureDetector gesture={innerGesture}>
                  <View className={`w-[15%] h-[15%] min-w-7 min-h-7 absolute flex-1 justify-center items-center rounded-full bg-black opacity-80`} >
                    <Image source={require('../assets/camera/move.png')} contentFit='contain' className='w-[70%] h-[70%] max-w-7 max-h-7' tintColor={'#FFFFFF'} />
                  </View>
                </GestureDetector>
              }
            </CropView>
          </PanView>
        </GestureDetector>
        {/* Top Bar */}
        <View className={`w-full h-20 z-30 absolute flex-row items-center bg-[#00000099]`} style={{ top: useSafeAreaInsets().top }}>
          <TouchableOpacity onPress={onHorizontalFlip} className={`flex-row flex-1 h-14 gap-3 items-center justify-center`}>
            <Text numberOfLines={1} adjustsFontSizeToFit className='text-white font-lilitaOne'>Horizontal Flip</Text>
            <Image source={require('../assets/camera/flip.png')} contentFit='contain' className='w-6 h-6' tintColor={'#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onVerticalFlip} className={`flex-row flex-1 h-14 gap-3 items-center justify-center`}>
            <Text numberOfLines={1} adjustsFontSizeToFit className='text-white font-lilitaOne'>Vertical Flip</Text>
            <Image source={require('../assets/camera/flip.png')} contentFit='contain' className='w-6 h-6 rotate-90' tintColor={'#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRotate} className={`flex-row flex-1 h-14 gap-3 items-center justify-center`}>
            <Text numberOfLines={1} adjustsFontSizeToFit className='text-white font-lilitaOne'>Rotote</Text>
            <Image source={require('../assets/camera/rotate.png')} contentFit='contain' className='w-6 h-6 rotate-90' tintColor={'#FFFFFF'} />
          </TouchableOpacity>
        </View>
        {/* Bottom Buttons */}
        <View className={`w-full h-20 z-30 absolute flex-row items-center justify-center bg-[#00000099]`} style={{ bottom: useSafeAreaInsets().bottom }}>
          <TouchableOpacity onPress={onDone} className={`w-[40vw] h-12 border-2 border-white rounded-full items-center justify-center`}>
            <Text className={`text-white text-xl font-josefinBold`}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingMadal visible={loading} color={'#F4AA35'} />
      <StatusBar style="light" backgroundColor="black" hidden={false} />
    </GestureHandlerRootView>
  );
}
