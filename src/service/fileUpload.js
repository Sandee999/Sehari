import supabase from "./supabase";
import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer";
import uuid from 'react-native-uuid';

export async function uploadProfilePic(id, uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const filePath = `${id}/profilePic.jpg`

  const { data, error } = await supabase.storage.from('profiles').upload(filePath, decode(base64), { upsert: true, contentType: 'image/jpeg', });

  if (error) return { data: null, error };

  return { data, error: null };
}

export async function uploadPlaceImage(id, uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const filePath = `${id}/${uuid.v4()}.jpg`

  const { data, error } = await supabase.storage.from('places').upload(filePath, decode(base64), { upsert: true, contentType: 'image/jpeg', });

  if (error) return { data: null, error };

  return { data, error: null };
}

export async function uploadItemImage(id, uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  const filePath = `${id}/itemPic.jpg`

  const { data, error } = await supabase.storage.from('items').upload(filePath, decode(base64), { upsert: true, contentType: 'image/jpeg', });

  if (error) return { data: null, error };

  return { data, error: null };
}