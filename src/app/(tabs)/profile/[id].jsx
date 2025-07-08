import { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGlobalValues } from '../../../context/GlobalProvider'
import { getProfile } from '../../../service/profile';
import { Image } from 'expo-image';
import { getIfCreator, setCreator } from '../../../service/userData';
import ProfilePicView from '../../../components/ProfilePicView';
import Reviews from '../../../components/profileComponents/Reviews';

export default function Profile() {
  const { id } = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const { userData, loadUser } = useGlobalValues();
  const isUser = id === userData.id;
  const [isCreator, setIsCreator] = useState(false);
  const [data, setData] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(()=>console.log(data),[data]);

  useEffect(() => {
    if(isUser) {
      setData(userData);
      setIsCreator(userData.isCreator);
    }
    else {
      const get = async() => {
        const data = await getProfile(id);
        setData(data);
        const x = await getIfCreator(id);
        console.log(x);
        setIsCreator(x.data.is_creator);
      }
      get();
    }
  },[]);

  async function onBecomeCreator() {
    try {
      const { error } = await setCreator(userData.id, true);
      if (error) {
        Alert.alert('Error', 'An error occurred.');
        return;
      }

      setIsCreator(true);
      Alert.alert('Success', 'You have successfully become a creator.');
      await loadUser();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }
  }

  function onAddPlace() {
    router.push(`/creatorAddPlace/${id}`);
  }

  return (
    <>
      <ScrollView className='w-full h-full bg-black' style={{ paddingTop: top, paddingBottom: bottom }}>
        <View className='w-full h-[50px] flex-row mx-6 gap-6 items-center'>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={require('../../../assets/home/backArrow.png')} contentFit='contain' className='w-[20px] h-[20px]' />
          </TouchableOpacity>
          <Text className='text-xl text-white font-poppinsMedium'>Profile</Text>
        </View>
        <View className='w-full h-[120px] flex-row'>
          <View className='w-[100px] h-full ml-5 items-center justify-center'>
            <View className='w-[70px] h-[70px] rounded-full bg-[#222]'>
              {data?.id && <ProfilePicView userId={data?.id} onPressRedirectEnabled={false} />}
            </View>
          </View>
          <View className='flex-1 items justify-center'>
            <Text className='text-2xl font-poppinsMedium text-white'>{data?.name}</Text>
            <Text className='text-base font-poppinsMedium text-[#D9D9D9]'>@{data?.username}</Text>
            {isCreator && <Text className='text-lg font-poppinsMedium text-[#D9D9D9]'>Content Creator</Text> }
          </View>
        </View>
        {isUser &&
          <View className='w-full flex-wrap flex-row justify-evenly items-center'>
            {isCreator ?
              <>
                <TouchableOpacity onPress={onAddPlace} className={`px-3 py-1 my-3 border-[1px] border-white rounded-xl`}>
                  <Text className='text-base text-white font-poppinsMedium'>+ Add a Place</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity className={`px-3 py-1 my-3 border-[1px] border-white rounded-xl`}>
                  <Text className='text-base text-white font-poppinsMedium'>📹 Make a Reel</Text>
                </TouchableOpacity> */}
              </>
              : 
              <TouchableOpacity onPress={onBecomeCreator} className={`px-3 py-1 border-[1px] border-white rounded-xl`}>
                <Text className='text-base text-white font-poppinsMedium'>Become a Creator</Text>
              </TouchableOpacity>
            }
          </View>
        }
        <View className='w-full h-[1px] bg-[#D9D9D9] opacity-10' />
        <View className='w-full mt-4 flex-row justify-evenly'>
          <TouchableOpacity onPress={() => setTabIndex(0)} disabled={tabIndex == 0} className={`w-[50vw] items-center`}>
            <Text className={`py-1 ${tabIndex == 0 ?'text-xl underline' : 'text-lg'} text-white font-poppinsMedium`}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTabIndex(1)} disabled={tabIndex == 1} className={`w-[50vw] items-center`}>
          <Text className={`py-1 ${tabIndex == 1 ?'text-xl underline' : 'text-lg'} text-white font-poppinsMedium`}>Reviews</Text>
          </TouchableOpacity>
        </View>
        <View className='w-full flex-1'>
          { tabIndex == 0 && <Text className='text-xl text-white font-josefinRegular m-6'>{'    '}{data?.taste}</Text>}
          { tabIndex == 1 && <Reviews id={id} />}
        </View>
      </ScrollView>
      <StatusBar style='light' hidden={false} />
    </>
  );
}