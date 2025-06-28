import supabase from './supabase';

export async function listFilesInFolder(bucket, folder) {
  const { data, error } = await supabase.storage.from(bucket).list(folder);

  if (error) {
    console.error('Error retrieving files:', error);
  } else {
    const paths = data.map(file => `${folder}/${file.name}`);
    const links = await supabase.storage.from(bucket).createSignedUrls(paths, 3600);
    return links.data.map(x => x.signedUrl);
  }
}
