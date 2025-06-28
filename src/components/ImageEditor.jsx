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
import cacheFile from "../utils/cacheFiles";

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
  try {
    await new Promise(resolve => setTimeout(resolve, 50));

    const layout = await measureBoxAsync();

    // --- BEGIN Critical Input Logging ---
    console.log('[onDone] Measured Layout:', JSON.stringify(layout));
    console.log('[onDone] ImageRef Dimensions (original image):', { width: imageRef.width, height: imageRef.height });
    console.log('[onDone] PanContainer Dimensions (display area):', { width: panDimensionsWidth.value, height: panDimensionsHeight.value });
    // --- END Critical Input Logging ---

    // --- Validate Initial Inputs ---
    if (!layout || typeof layout.x !== 'number' || typeof layout.y !== 'number' ||
        typeof layout.width !== 'number' || typeof layout.height !== 'number') {
      throw new Error(`Layout measurement failed or returned non-numeric values: ${JSON.stringify(layout)}`);
    }
    // If layout width/height are 0 or negative (can happen if measure fails or view isn't rendered), crop will be invalid.
    if (layout.width <= 0 || layout.height <= 0) {
        throw new Error(`Layout measurement returned non-positive dimensions: width=${layout.width}, height=${layout.height}. View might not be rendered or measurable.`);
    }
    if (!imageRef || !imageRef.width || !imageRef.height || imageRef.width <= 0 || imageRef.height <= 0) {
      throw new Error(`Invalid source image dimensions in imageRef: width=${imageRef?.width}, height=${imageRef?.height}`);
    }
    if (!panDimensionsWidth || !panDimensionsHeight || panDimensionsWidth.value <= 0 || panDimensionsHeight.value <= 0) {
      throw new Error(`Invalid pan container dimensions: width=${panDimensionsWidth?.value}, height=${panDimensionsHeight?.value}`);
    }
    // --- End Validate Initial Inputs ---

    // Calculate crop dimensions based on the original image's full size
    // These are in the original image's coordinate space.
    const calculatedCrop = {
      originX: (layout.x / panDimensionsWidth.value) * imageRef.width,
      originY: (layout.y / panDimensionsHeight.value) * imageRef.height,
      width: (layout.width / panDimensionsWidth.value) * imageRef.width,
      height: (layout.height / panDimensionsHeight.value) * imageRef.height,
    };
    console.log('[onDone] Calculated Crop (float values):', JSON.stringify(calculatedCrop));

    // --- Sanitize Crop Dimensions ---
    // Most image libraries expect integer coordinates and dimensions for cropping.
    let finalCropDimensions = {
      originX: Math.floor(calculatedCrop.originX),
      originY: Math.floor(calculatedCrop.originY),
      width: Math.floor(calculatedCrop.width),
      height: Math.floor(calculatedCrop.height),
    };

    // 1. Ensure origins are non-negative and within image bounds.
    finalCropDimensions.originX = Math.max(0, finalCropDimensions.originX);
    finalCropDimensions.originY = Math.max(0, finalCropDimensions.originY);
    // Origin cannot be beyond the image edge (e.g. originX cannot be imageRef.width, max is imageRef.width - 1)
    finalCropDimensions.originX = Math.min(finalCropDimensions.originX, imageRef.width - 1);
    finalCropDimensions.originY = Math.min(finalCropDimensions.originY, imageRef.height - 1);


    // 2. Ensure dimensions are positive (at least 1px).
    finalCropDimensions.width = Math.max(1, finalCropDimensions.width);
    finalCropDimensions.height = Math.max(1, finalCropDimensions.height);

    // 3. Ensure the crop rectangle (origin + dimension) does not extend beyond image boundaries.
    // Adjust width if originX + width > imageRef.width
    if (finalCropDimensions.originX + finalCropDimensions.width > imageRef.width) {
      finalCropDimensions.width = imageRef.width - finalCropDimensions.originX;
    }
    // Adjust height if originY + height > imageRef.height
    if (finalCropDimensions.originY + finalCropDimensions.height > imageRef.height) {
      finalCropDimensions.height = imageRef.height - finalCropDimensions.originY;
    }

    // 4. Re-check width/height after adjustment (they could become <=0 if origin was at the edge)
    //    For example, if originX = imageRef.width - 1, and initial width made it go out,
    //    width becomes imageRef.width - (imageRef.width - 1) = 1. This is correct.
    //    If originX was imageRef.width (already clamped to imageRef.width - 1),
    //    and width was large, width becomes imageRef.width - (imageRef.width-1) = 1.
    //    If width was already small and correct, it remains.
    //    This ensures width/height are at least 1 and fit.
    finalCropDimensions.width = Math.max(1, finalCropDimensions.width);
    finalCropDimensions.height = Math.max(1, finalCropDimensions.height);


    console.log('[onDone] Final Sanitized Crop Dimensions:', JSON.stringify(finalCropDimensions));
    console.log('[onDone] Checking against Image Dimensions:', {imgW: imageRef.width, imgH: imageRef.height});

    // --- Final explicit check before passing to imageContext ---
    if (
      finalCropDimensions.originX < 0 ||
      finalCropDimensions.originY < 0 ||
      finalCropDimensions.width <= 0 ||
      finalCropDimensions.height <= 0 ||
      (finalCropDimensions.originX + finalCropDimensions.width) > imageRef.width ||
      (finalCropDimensions.originY + finalCropDimensions.height) > imageRef.height
    ) {
      const errorDetails = `originX=${finalCropDimensions.originX}, originY=${finalCropDimensions.originY}, width=${finalCropDimensions.width}, height=${finalCropDimensions.height}. Image: ${imageRef.width}x${imageRef.height}. Right_Edge_Calc: ${finalCropDimensions.originX + finalCropDimensions.width}, Bottom_Edge_Calc: ${finalCropDimensions.originY + finalCropDimensions.height}`;
      throw new Error(`Invalid crop dimensions after sanitization: ${errorDetails}. This likely indicates a problem with initial layout measurements or source image dimensions.`);
    }

    imageContext.crop(finalCropDimensions);
    console.log('[onDone] Crop applied. Resizing to 500x500...');
    imageContext.resize({ width: 500, height: 500 }); // This should resize the cropped content

    const image = await imageContext.renderAsync(); // Error occurs here if crop was bad
    console.log('[onDone] Image rendered. Saving...');

    const result = await image.saveAsync({
      format: ImageManipulator.SaveFormat.JPEG,
      compress: 0.7, // Using 0.7 for better quality than 0.3 for a 500x500 image
    });
    console.log('[onDone] Image saved:', result.uri);

    await cacheFile(result.uri, saveToCacheFileName);
    router.back();

  } catch (error) {
    console.error("[onDone] ERROR:", error.message, error.stack);
    // Inform the user if appropriate, e.g., via a toast or alert.
  } finally {
    setLoading(false);
  }
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
            {
              <View className='px-3 py-1 absolute bottom-5 bg-[#FFFFFFAA] rounded-full'>
                <Text className='text-sm font-poppinsRegular'>Drag on Image to Crop</Text>
              </View>
            }
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
        <View className={`w-full h-20 z-30 absolute flex-row items-center justify-evenly bg-[#00000099]`} style={{ bottom: useSafeAreaInsets().bottom }}>
          <TouchableOpacity onPress={() => router.back()} className={`w-[40vw] h-12 border-2 border-white rounded-full items-center justify-center`}>
            <Text className={`text-white text-xl font-josefinBold`}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDone} className={`w-[40vw] h-12 border-2 border-white rounded-full items-center justify-center`}>
            <Text className={`text-white text-xl font-josefinBold`}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingMadal visible={loading} color={'#F4AA35'} />
      <StatusBar style="light" hidden={false} />
    </GestureHandlerRootView>
  );
}
