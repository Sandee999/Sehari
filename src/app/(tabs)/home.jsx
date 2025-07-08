import { useState,  useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Text } from 'react-native';
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

  const [refresh, setRefresh] = useState({
    "PicksForYou": false,
  });

  const onRefresh = useCallback(() => {
    setRefresh({
      "PicksForYou": true,
    });
  }, []);

  return (
    <View className='w-full h-full bg-black'>
      <ScrollView 
        style={{ flexGrow: 1 }} 
        contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1 }} 
        refreshControl={
          <RefreshControl 
            refreshing={Object.values(refresh).some(value => value===true)} 
            onRefresh={onRefresh} 
          />
        }
      >
        <View style={{ height: insets.top }} />
        <BgVideo />
        <Header />
        <HomeSearchBarButton onPress={()=>router.push('/placeSearch')} />
        <PicksForYou refresh={refresh} setRefresh={setRefresh} />
        <UnderTheMoon />
        <View style={{ height: insets.bottom+20 }} />
      </ScrollView>
      <StatusBar animated style='light' hidden />
    </View>
  );
} 