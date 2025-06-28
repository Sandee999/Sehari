import { Image } from 'expo-image';

export default function ProfilePicView({ userId, margin = 3 }) {
  const profilePicLink = `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/profiles/${userId}/profilePic.jpg?t=${Date.now()}`;
  const profilePicPlaceholder = `${process.env.EXPO_PUBLIC_SUPABASE_URL || ''}/storage/v1/object/public/profiles/default/profilePic.jpg`;
  const blurhash ='KTG[~E8wG^TftRt8I:tmiv';

  return <Image 
    source={{ uri: profilePicLink }} 
    contentFit='cover' 
    placeholder={{blurhash}} 
    placeholderContentFit='cover' 
    style={{ flexGrow: 1, borderRadius: 9999, backgroundColor: '#FFFFFF', margin: margin }} 
  />;
}