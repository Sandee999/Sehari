import getLocationForegroundPermissions from "./getLocationForegroundPermissions";
import { getLastKnownPositionAsync } from "expo-location";

export default async function getUserLocation(setUserLocation) {
  const status = await getLocationForegroundPermissions();
  if (status !== 'granted') return;

  try {
    const location = await getLastKnownPositionAsync();
    if (setUserLocation) setUserLocation(location.coords);
    return location.coords;
  } catch (error) {
    console.error("Error getting location:", error);
    Alert.alert("Location Error", "Failed to get your location. Please try again.");
  }
}
