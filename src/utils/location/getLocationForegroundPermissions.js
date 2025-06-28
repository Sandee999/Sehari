import { requestForegroundPermissionsAsync } from 'expo-location';
import { Alert, Linking } from 'react-native';

export default async function getLocationForegroundPermissions() {
  let { status, canAskAgain } = await requestForegroundPermissionsAsync();
  if(!canAskAgain){
    Alert.alert(
      'Permission Required',
      'Location permission is required to use this feature. You can allow access in the app settings.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
          style: 'default',
        },
      ]
    )
  }
  return status;
}