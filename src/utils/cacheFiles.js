import * as FileSystem from 'expo-file-system';

export default async function cacheFile(uri, saveToName) {
  const cachePath = `${FileSystem.cacheDirectory}${saveToName}`;
  const fileInfo = await FileSystem.getInfoAsync(cachePath);

  if (fileInfo.exists) {
    await FileSystem.deleteAsync(cachePath, { idempotent: true });
  }

  // Check if the URI is a valid HTTP/HTTPS URL
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    const { uri: localUri } = await FileSystem.downloadAsync(uri, cachePath);
    return localUri;
  } else if (uri.startsWith('file://')) {
    await FileSystem.copyAsync({ from: uri, to: cachePath });
    return cachePath; // Return the cache path for local files
  } else {
    console.error('Invalid URI scheme.');
  }
}