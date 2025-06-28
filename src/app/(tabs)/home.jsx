import { useState,  useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedRef, useScrollViewOffset } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '../../components/homeComponents/Header';
import BgVideo from '../../components/homeComponents/bgVideo';
import HomeSearchBarButton from '../../components/homeComponents/homeSearchBarButton';
import PicksForYou from '../../components/homeComponents/PicksForYou';
import { router } from 'expo-router';
import UnderTheMoon from '../../components/homeComponents/UnderTheMoon';


export default function Index() {
  const insets = useSafeAreaInsets();
  const AnimatedScrollview = Animated.createAnimatedComponent(ScrollView);
  const scrollViewRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollViewRef);

  const [refresh, setRefresh] = useState({
    "PicksForYou": true,
  });

  const onRefresh = useCallback(() => {
    setRefresh({
      "PicksForYou": true,
    });
  }, []);

  return (
    <View className='w-full h-full bg-black'>
      <AnimatedScrollview 
        ref={scrollViewRef}
        style={{ flexGrow: 1 }} 
        contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1 }} 
        // stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl refreshing={Object.values(refresh).some(value => value===true)} onRefresh={onRefresh} />
        }
      >
        <BgVideo />
        <Header />
        <HomeSearchBarButton scrollOffset={scrollOffset} onPress={()=>router.push('/placeSearch')} />
        <PicksForYou refresh={refresh} setRefresh={setRefresh} />
        <UnderTheMoon />
        <View style={{ height: insets.bottom+20 }} />
      </AnimatedScrollview>
      <StatusBar animated style='light' hidden />
    </View>
  );
}