import { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadPlaceImage } from '../../../service/fileUpload';
import LoadingModal from '../../../components/loadingModal';

export default function CreatorAddPlaceImage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

    const onFilePress = async () =>{
      try {
        setLoading(true);
        const files = await DocumentPicker.getDocumentAsync({type:'image/*'});
        if(files.canceled) return;
        const imageContext = ImageManipulator.ImageManipulator.manipulate(files.assets[0].uri);
        const image = await imageContext.renderAsync();
        const result = await image.saveAsync({
          format: ImageManipulator.SaveFormat.JPEG,
        });
        
        const { error } = await uploadPlaceImage(id, result.uri);
        if(error){
          Alert.alert('Error in uploading', error.message);
          return;
        };
        Alert.alert('Success', 'Image uploaded successfully.', [{text: 'OK', onPress: () => router.back()}]);
        router.back();
      
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <View className="w-full h-full items-center justify-center">
          <TouchableWithoutFeedback onPress={() => null}>
            <View className='w-[85vw] h-[30vh] items-center justify-evenly bg-white rounded-2xl'>
              <Text className={`w-max text-center text-black text-2xl font-josefinBold`}>Choose an Option</Text>
              <TouchableOpacity onPress={onFilePress} className={`w-[25vw] h-[25vw] justify-center items-center rounded-xl bg-[#F4AA35]`}>
                <Image source={require('../../../assets/camera/files.png')} tintColor={'black'} contentFit='contain' className={`w-[10vw] h-[10vw]`} />
                <Text className={`text-black text-lg font-josefinRegular`}>Files</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <LoadingModal visible={loading} color={'#FFFFFF'} bgColor={'#FFFFFF66'} />
    </>
  );
}