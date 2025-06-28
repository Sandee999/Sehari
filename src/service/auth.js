import supabase from "./supabase";

export async function retriveUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if(error?.name === 'AuthSessionMissingError' || error?.name === 'AuthApiError'){
      return null;
    }
    throw error;
  }
  
  if (!data.user) {
    const noUserError = new Error("User not found in session.");
    noUserError.name = "AuthUserNotFoundError";
    throw noUserError;
  }

  return data.user;
}

export async function signInWithPhone(phone) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });

  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}

export async function verifyPhone(phone, otp) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: otp,
    type: 'sms',
  })

  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}