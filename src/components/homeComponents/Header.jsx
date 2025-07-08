import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useGlobalValues } from '../../context/GlobalProvider';
import getUserLocation from '../../utils/location/getUserLocation';
import reverseGeocode from '../../utils/location/reverseGeocode';
import ProfilePicView from '../ProfilePicView';


export default function Header() {
  const { userData, setUserLocation } = useGlobalValues();
  const [userGeocodedAddress, setUserGeocodedAddress] = useState(null);
  
  const set = useCallback(async()=> {
    await getUserLocation(setUserLocation).then(async(location) => {
      await reverseGeocode(location).then((res) => setUserGeocodedAddress(res));
    });
  },[]);

  useEffect(() => { 
    set();
  }, []);

  return(
    <View className={`w-full px-3 flex-row items-center`} style={{ height: 70 }}>
      <View style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: '#FFFFFF33', overflow: 'hidden' }}>
        <ProfilePicView userId={userData.id} />
      </View>
      <View className={`flex-1 mx-3 items-start justify-between`}>
        <Text className='text-xl text-white font-poppinsBold'>Hey {userData.username}</Text>
        {userGeocodedAddress ? 
          <Text numberOfLines={1}  className='text-xs text-white font-poppinsLight'>{`${userGeocodedAddress.city||userGeocodedAddress.district}, ${userGeocodedAddress.region}`}</Text> 
          : 
          <TouchableWithoutFeedback onPress={set}>
            <Text className='text-xs text-white font-poppinsLight'>Tap to set location</Text>
          </TouchableWithoutFeedback>
        }
      </View>
    </View>
  );
}