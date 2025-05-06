import { createContext, useContext, useState, useRef } from "react";
import { retriveUser } from "../service/auth";
import { getProfile } from "../service/profile";
import { downloadProfilePic } from "../service/fileDownload";

const GlobalContext = createContext(null);

export default function GlobalProvider({ children }) {
  const [userData, setUserData] = useState();

  const loadUser = async () => {
    const { data, error } = await retriveUser();
    if (error) return { data: null, error };
    setUserData({ id: data.id });

    const { data: profileData, error: profileError } = await getProfile(data.id);
    if (profileError) return { data: { id: data.id }, error: profileError };
    setUserData({ id: data.id, ...profileData });
    
    const { data: profilePicUri, error: profilePicError } = await downloadProfilePic(data.id);
    if(profilePicError?.message === 'Object not found') {
      return { data: { id: data.id, ...profileData, profilePicUri: null }, error: null };
    }
    else if (profilePicError) return { data: { id: data.id, ...profileData }, error: profilePicError };
    
    setUserData({ id: data.id, ...profileData, profilePicUri: profilePicUri });
    return { data: { id: data.id, ...profileData, profilePicUri: profilePicUri }, error: null };
  };

  const contextValues = { userData, loadUser };

  return (
    <GlobalContext.Provider value={contextValues}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalValues = () => useContext(GlobalContext);
