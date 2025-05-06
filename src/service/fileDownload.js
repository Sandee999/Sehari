import supabase from "./supabase";
import * as FileSystem from "expo-file-system";

export async function downloadProfilePic(userID) {
  try {
    const { data, error } = await supabase.storage.from('profiles').createSignedUrl(`${userID}/profilePic.jpg`, 3600,{
      transform:{
        width: 100,
        height: 100,
        resize: 'cover',
        quality: 20
      }
    });

    if(error) return { data: null, error };
    
    return { data: data.signedUrl, error: null };
  } catch (error) {
    console.error('At downloadProfilePic:', error);
    return { data: null, error: error.message };
  }
}
