import supabase from "./supabase";

export async function updateUserLocation(userId, longitude, latitude) {
  const { error } = await supabase.rpc('update_user_location', {
    p_user_id: userId,
    p_lng: longitude,
    p_lat: latitude
  });

  if (error) {
    console.error("Error updating location:", error);
  }
}