import { getCurrentPositionAsync } from 'expo-location';
import getLocationForegroundPermissions from './getLocationForegroundPermissions';

export default async function getUserLocation(setUserLocation) {
  // Request location permissions
  const status = await getLocationForegroundPermissions();
  if (status !== 'granted') return;

  // Get the current location if permission is granted
  const location = await getCurrentPositionAsync({});
  if(setUserLocation) setUserLocation(location.coords);
  return location.coords;
}
