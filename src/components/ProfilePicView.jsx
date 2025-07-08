import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

export default function ProfilePicView({ userId, margin = 3, onPressRedirectEnabled = true }) {
  const profilePicLink = `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/profiles/${userId}/profilePic.jpg?t=${Date.now()}`;
  // const profilePicPlaceholder = `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/profiles/default/profilePic.jpg`;
  // const blurhash ='KTG[~E8wG^TftRt8I:tmiv';

  return useCallback((
    <TouchableOpacity activeOpacity={.8} onPress={()=>onPressRedirectEnabled ? router.push(`/profile/${userId}`) : null} className='flex-1'>
      <Image 
        source={{ uri: profilePicLink }} 
        contentFit='cover' 
        // placeholder={{blurhash}} 
        placeholderContentFit='cover' 
        style={{ flexGrow: 1, borderRadius: 9999, backgroundColor: '#3F3F3F', margin: margin }} 
      />
    </TouchableOpacity>
  ), []);
}