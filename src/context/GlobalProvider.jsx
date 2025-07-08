import { createContext, useContext, useEffect, useState } from "react";
import { UserStatus } from "../utils/constants";
import { retriveUser } from "../service/auth";
import { getProfile } from "../service/profile";
import { getIfCreator, updateUserLocation } from "../service/userData";

const GlobalContext = createContext(null);

export default function GlobalProvider({ children }) {
  const [userStatus, setUserStatus] = useState(UserStatus.IDLE);
  const [userData, setUserData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  async function loadUser() {
    try {
      const retrivedUserData = await retriveUser();
      if(!retrivedUserData) {
        setUserData(null);
        setUserStatus(UserStatus.NOT_LOGGED_IN);
        return;
      }
      setUserStatus(UserStatus.LOADING)

      const profileData = await getProfile(retrivedUserData.id);
      if(!profileData) {
        setUserData({ id: retrivedUserData.id });
        setUserStatus(UserStatus.NEEDS_PROFILE_COMPLETION);
        return;
      }
      if(!profileData.name){
        setUserData({ id: retrivedUserData.id, ...profileData });
        setUserStatus(UserStatus.NEEDS_PROFILE_COMPLETION);
        return;
      }

      const { data: isCreator, error } = await getIfCreator(retrivedUserData.id);

      if(error) {
        throw error;
      }

      setUserData({ id: retrivedUserData.id, ...profileData, isCreator: isCreator.is_creator });
      setUserStatus(UserStatus.LOGGED_IN);
    } catch (error) {
      setUserStatus(UserStatus.NO_INTERNET);
    }
  };

  useEffect(() => {
    if (!userData || !userLocation || typeof userLocation.longitude !== 'number'  || typeof userLocation.latitude !== 'number' ) {
      return;
    }

    (async () => {
      await updateUserLocation(userData.id, userLocation.longitude, userLocation.latitude);
    })();

    const interval = setInterval(async() => {
      await updateUserLocation(userData.id, userLocation.longitude, userLocation.latitude);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, [userLocation]);

  const contextValues = { userData, loadUser, userStatus, userLocation, setUserLocation };

  return (
    <GlobalContext.Provider value={contextValues}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalValues = () => useContext(GlobalContext);