import { reverseGeocodeAsync } from "expo-location";

export default async function reverseGeocode(location) {
  const result = await reverseGeocodeAsync(location);
  return result[0];
}