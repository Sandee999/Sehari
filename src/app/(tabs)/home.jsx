import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useGlobalValues } from '../../context/GlobalProvider';
import { downloadProfilePic } from '../../service/fileDownload';
import { File, Paths } from 'expo-file-system/next';
import { router } from 'expo-router';

export default function Home() {
  const { userData, loadUser } = useGlobalValues();

  useEffect(() => {
    const loadUserData = async () => {
      const { error } = await loadUser();
      if(error) router.replace('/noInternet/home');
    };
    loadUserData();
  },[]);

  return (
    <View className='w-full h-full items-center justify-center'>
      <Image source={{ uri: userData.profilePicUri }} className='w-[80vw] h-[80vw] rounded-full bg-slate-500' />
      <Text>username : {userData.username}</Text>
      <Text>name : {userData.name}</Text>
      <Text>DOB : {userData.DOB}</Text>
      <Text>taste : {userData.taste}</Text>
    </View>
  );
}