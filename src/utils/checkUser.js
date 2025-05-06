export default async function checkUser(loadUser) {
  const { data, error } = await loadUser();
  if(error?.name === 'AuthSessionMissingError' || error?.name === 'AuthApiError'){
    return('/login');
  }
  else if(error?.code==='PGRST116'){
    return('/register');
  }
  else if(!data) {
    return('/noInternet/root');
  }else {
    const hasNull = Object.values(data).some((value) => value === null);
    if (hasNull && data?.profilePicUri !== null) {
      return('/register');
    }
    return('/home');
  }
}