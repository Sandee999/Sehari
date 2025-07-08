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

export async function getIfCreator(userId) {
  const { data, error } = await supabase
  .from('user_data')
  .select('is_creator')
  .eq('id', userId)
  .single();

  if (error) {
    console.error('Error fetching data:', error);
  }
  return { data, error };
}

export async function setCreator(userId, value) {
  const { error } = await supabase
  .from('user_data')
  .update({ is_creator: value })
  .eq('id', userId);

  if (error) {
    console.error('Error updating data:', error);
  }
  return { error };
}

export async function getItemRatingAndReview(item_id, lowerBound, upperBound) {
  const { data, error } = await supabase
  .from('user_item_rating')
  .select(`
    profiles (
      id,
      username,
      name
    ),
    user_item_rating,
    user_item_review
  `)
  .eq('item_id', item_id)
  .order('user_item_rating', { ascending: false })
  .range(lowerBound, upperBound);

  if (error) {
    console.error('Error fetching data:', error);
  } 

  if(data && data.length > 0) {
    return data.map((x) => {
      return {
        user_id: x.profiles.id,
        username: x.profiles.username,
        name: x.profiles.name,
        rating: x.user_item_rating,
        review: x.user_item_review
      }
    });
  }
}

export async function getUserReviewAndRating(user_id, item_id) {
  const { data, error } = await supabase
  .from('user_item_rating')
  .select(`
    profiles (
      id,
      username,
      name
    ),
    user_item_rating,
    user_item_review
  `)
  .match({
    user_id: user_id,
    item_id: item_id
  })
  .single();

  if (error) {
    console.error('Error fetching user review:', error);
  }

  const finalData = {
    user_id: data.profiles.id,
    username: data.profiles.username,
    name: data.profiles.name,
    rating: data.user_item_rating,
    review: data.user_item_review
  }
  return { data: finalData, error };
} 

export async function setUserReview(user_id, item_id, review) {
  const { data, error } = await supabase
  .from('user_item_rating')
  .upsert({
    user_id: user_id,
    item_id: item_id,
    user_item_review: review
  })
  .select()
  .single();

  const { data: reviewData, error: reviewError } = await getUserReviewAndRating(data.user_id, data.item_id)

  if (error) {
    console.error('Error updating user review:', error);
  } else if (reviewError) {
    console.error('Error fetching user review:', reviewError);
  }

  return { data: reviewData, error: reviewError };
}

export async function setUserRating(user_id, item_id, rating) {
  const { data, error } = await supabase
  .from('user_item_rating')
  .upsert({
    user_id: user_id,
    item_id: item_id,
    user_item_rating: rating
  })
  .select()
  .single();

  const { data: reviewData, error: reviewError } = await getUserReviewAndRating(data.user_id, data.item_id)

  if (error) {
    console.error('Error updating user review:', error);
  } else if (reviewError) {
    console.error('Error fetching user review:', reviewError);
  }

  return { data: reviewData, error: reviewError };
}