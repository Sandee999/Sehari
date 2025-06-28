import { Text, View, TouchableWithoutFeedback } from 'react-native';
import Animated, { ReduceMotion, useAnimatedReaction, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function HomeSearchBarButton({ scrollOffset, onPress }) {
  // const insets = useSafeAreaInsets();
  const marginTop = useSharedValue(10);

  // useAnimatedReaction(() => scrollOffset.value, (value) =>{
  //   const y = 10 + (Math.min(Math.max(0, value-(70+insets.top)), insets.top));
  //   marginTop.value = withSpring(y, {
  //     mass: 0.1,
  //     damping: 150,
  //     stiffness: 10,
  //     overshootClamping: false,
  //     restDisplacementThreshold: 0.01,
  //     restSpeedThreshold: 2,
  //     reduceMotion: ReduceMotion.System,
  //   });
  // });

  return(
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View className={`w-[90vw] flex-row bg-white border-2 border-neutral-300 rounded-2xl`} style={{ height: 43, transform: [{ translateY: marginTop }] }}>
        <MaterialIcons name="search" size={24} color="#A3A3A3" style={{ width: 43, height: 43, paddingBottom: 2, textAlign: 'center', textAlignVertical: 'center' }} />
        <Text className='pt-1 flex-grow-[1] align-middle text-lg text-neutral-400 font-poppinsRegular'>Search for idlli with...</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}