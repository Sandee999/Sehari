import supabase from "./supabase";

export async function getPlaceDetails(place_id) {

  const { data, error } = await supabase
    .from('place_details')
    .select('*')
    .eq('place_id', place_id)
    .single();

  if (error) console.error(error)

  return data;
}

export async function getItemDetailsByPlace(place_id) {
  
  const { data: item_details, error } = await supabase
  .from('item_details')
  .select('*')
  .eq('place_id', place_id);

  if (error) console.error(error)

  return item_details;
}

export async function getItemDetailsById(item_id) {
  const { data: itemData, error } = await supabase
    .from('item_details')
    .select('*')
    .eq('item_id', item_id)
    .single();

  if (error) throw error

  const { data: placeData, error: placeError } = await supabase
    .from('place_details')
    .select('*')
    .eq('place_id', itemData.place_id)
    .single();

  if (placeError) throw placeError

  return { ...itemData, ...placeData };
}

export async function getNearbyPlaces(user_id) {

  let { data, error } = await supabase.rpc('get_nearby_places', { user_id: user_id });
  if (error) throw error
  
  if(data.length > 0) return data

  const { data: topPlaces, error: topPlacesError } = await supabase
    .from('place_details')
    .select('*')
    .order('place_rating', { ascending: false })
    .limit(10);

  if (topPlacesError) throw topPlacesError

  return topPlaces;
}

export async function getLeastPriceAtPlace(place_id) {
  const { data, error } = await supabase
    .from('item_details')
    .select('item_id, item_name, item_price')
    .eq('place_id', place_id)
    .order('item_price', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching least priced item:', error);
    return null;
  }

  return data?.[0] || null;
}

export async function getTopPlaces(search_text) {
  const cleanSearch = search_text?.trim();

  const { data: topPlaces, error: topPlacesError } = await supabase
    .from('place_details')
    .select('*')
    .or(`place_name.ilike.%${cleanSearch}%,place_type.ilike.%${cleanSearch}%,place_description.ilike.%${cleanSearch}%`)
    .order('place_rating', { ascending: false })
    .limit(10);

  if (topPlacesError) {
    console.error("Fallback query error:", topPlacesError);
  }

  return topPlaces || [];
}

export async function getNearbyPlacesByText(user_id, search_text) {
  const cleanSearch = search_text?.trim();

  if (!user_id || !cleanSearch) {
    console.warn('Missing user_id or search_text');
    return [];
  }

  const { data, error } = await supabase.rpc('get_nearby_places_by_text', {
    user_id: user_id,
    search_text: cleanSearch
  });

  if (error) {
    console.error("RPC Error:", error);
  }

  if (data && data.length > 0) {
    return data;
  }

  return await getTopPlaces(search_text);
}

export async function getTopItems(search_text) {
  const { data, error } = await supabase
    .from('item_details')
    .select('item_id, item_name, item_price, item_rating, place_id')
    .ilike('item_name', `%${search_text}%`)
    .order('item_rating', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Fallback item fetch error:", error);
  }

  return data || [];
}

export async function getNearbyItemsByText(user_id, search_text) {
  const cleanSearch = search_text?.trim();

  if (!user_id || !cleanSearch) {
    console.warn('Missing user_id or search_text');
    return [];
  }

  const { data, error } = await supabase.rpc('get_nearby_items_by_text', {
    user_id: user_id,
    search_text: cleanSearch
  });

  if (error) {
    console.error("RPC Error (get_nearby_items_by_text):", error);
  }

  if (data && data.length > 0) {
    return data;
  }

  return await getTopItems(cleanSearch);
}

export async function getNearbyItems(user_id) {
  const { data, error } = await supabase.rpc('get_nearby_items_by_text', {
    user_id: user_id,
    search_text: ''
  });

  if (error) {
    console.error("RPC Error (get_nearby_items_by_text):", error);
  }

  if (data && data.length > 0) {
    return data;
  }

  return await getTopItems('');
}