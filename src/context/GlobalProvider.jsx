import { createContext, useContext, useState } from "react";
import * as FileSystem from "expo-file-system";
import { retriveUser } from "../service/auth";
import { getProfile } from "../service/profile";
import { downloadProfilePic } from "../service/fileDownload";
import cacheFile from "../utils/cacheFiles";

const GlobalContext = createContext(null);

export default function GlobalProvider({ children }) {
  const [userData, setUserData] = useState();

  const loadUser = async () => {
    const { data, error } = await retriveUser();
    if (error) return { data: null, error };
    setUserData({ id: data.id });

    const { data: profileData, error: profileError } = await getProfile(data.id);
    if (profileError) return { data: { id: data.id }, error: profileError };
    setUserData((prev)=>({ ...prev, ...profileData }));
    
    const { data: profilePicUri, error: profilePicError } = await downloadProfilePic(data.id);
    if(profilePicError?.message === 'Object not found') {
      return { data: { id: data.id, ...profileData }, error: null };
    }
    else if (profilePicError) return { data: { id: data.id, ...profileData }, error: profilePicError };
    
    const cacheUri = await cacheFile(profilePicUri, `profilePic.jpg`);

    setUserData((prev)=>({ ...prev, profilePicUri: cacheUri+`?t=${Date.now()}` }));
    return { data: { id: data.id, ...profileData, profilePicUri: cacheUri+`?t=${Date.now()}` }, error: null };
  };

  const contextValues = { userData, loadUser };

  return (
    <GlobalContext.Provider value={contextValues}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalValues = () => useContext(GlobalContext);
