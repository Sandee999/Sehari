import supabase from "./supabase";
import { retriveUser } from "./auth";
import { File } from "expo-file-system/next";
import { decode } from "base64-arraybuffer";

export async function uploadProfilePic(uri) {
  const { data: user, error: userError } = await retriveUser();
  if (userError) return { data: null, error: userError };

  const base64 = new File(uri).base64()
  const filePath = `${user.id}/profilePic.jpg`

  const { data, error } = await supabase.storage.from('profiles').upload(filePath, decode(base64), { upsert: true });

  if (error) return { data: null, error };

  return { data, error: null };
}
