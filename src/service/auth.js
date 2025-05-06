import supabase from "./supabase";

export async function retriveUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { data: null, error };
  }
  return { data: data.user, error: null };
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