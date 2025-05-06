import * as FileSystem from 'expo-file-system';

export default async function cacheFile(uri, name) {
  const fileUri = `${FileSystem.cacheDirectory}${name}`;
  try {
    await FileSystem.downloadAsync(uri, fileUri);
    return fileUri;
  } catch (err) {
    console.warn("Failed to cache image:", err);
    return null;
  }
};
