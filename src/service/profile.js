import supabase from "./supabase";

export async function getProfile(userID) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userID)
    .single();

  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}

export async function getProfileByUsername(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}

export async function createProfile(userID, username) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userID,
        username: username,
      },
    ])
    .select("*")
    .single();

  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}

export async function updateProfile(userID, dataObject) {
  const { data, error } = await supabase
    .from("profiles")
    .update(dataObject)
    .eq("id", userID)
    .select("*")
    .single();

  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}