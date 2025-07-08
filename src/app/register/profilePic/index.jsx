import { useEffect, useState } from "react";
import { Image, ImageBackground } from "expo-image";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Alert } from "react-native";
import { Paths, File } from 'expo-file-system/next';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { uploadProfilePic } from "../../../service/fileUpload";
import LoadingModal from "../../../components/loadingModal";
import cacheFile from "../../../utils/cacheFiles";
import { useGlobalValues } from "../../../context/GlobalProvider";

const OptionsModal = ({ optionsVisible, setOptionsVisible }) =>{
  const onCameraPress = () =>{
    router.push('/register/profilePic/profilePicCamera');
    setOptionsVisible((prev) => !prev)
  }
  
  const onFilePress = async () =>{
    const files = await DocumentPicker.getDocumentAsync({type:'image/*'});
    if(files.canceled) return;
    const imageContext = ImageManipulator.ImageManipulator.manipulate(files.assets[0].uri);
    const image = await imageContext.renderAsync();
    const result = await image.saveAsync({
      format: ImageManipulator.SaveFormat.JPEG,
    });
    await cacheFile(result.uri, 'pfp.jpg');
    router.push('/register/profilePic/imageEdit');
    setOptionsVisible((prev) => !prev);
  }
  
  return(
    <Modal
      animationType='slide'
      transparent={true}
      visible={optionsVisible}
      onRequestClose={() => setOptionsVisible((prev) => !prev)}
    >
      <TouchableWithoutFeedback onPress={() => setOptionsVisible((prev) => !prev)}>
        <View className={`w-full h-full justify-center items-center`}>
          <TouchableWithoutFeedback>
            <View className={`w-[85vw] h-[45vw] items-center justify-evenly bg-white rounded-2xl`}>
              <Text className={`w-max text-center text-black text-2xl font-josefinBold`}>Choose an Option</Text>
              <View className={`w-full flex-row items-center justify-evenly`}>
                <TouchableOpacity onPress={onFilePress} className={`w-[25vw] h-[25vw] justify-center items-center rounded-xl bg-[#F4AA35]`}>
                  <Image source={require('../../../assets/camera/files.png')} tintColor={'black'} contentFit='contain' className={`w-[10vw] h-[10vw]`} />
                  <Text className={`text-black text-lg font-josefinRegular`}>Files</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onCameraPress} className={`w-[25vw] h-[25vw] justify-center items-center rounded-xl bg-[#219EBC]`}>
                  <Image source={require('../../../assets/camera/cam.png')} tintColor={'black'} contentFit='contain' className={`w-[10vw] h-[10vw]`} />
                  <Text className={`text-black text-lg font-josefinRegular`}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function ProfilePicIndex() {
  const [loading, setLoading] = useState(false);
  const [uri, setUri] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updatedUri = new File(Paths.cache, 'profilePic.jpg').uri + `?t=${Date.now()}`;
      setUri(updatedUri);
    });
  
    return unsubscribe;
  }, [navigation]);
  
  const { loadUser, userData } = useGlobalValues();
  const onSubmit = async() => {
    setLoading(true);
    if(new File(uri).exists){
      const { error } = await uploadProfilePic(userData.id, uri);
      if(error) {
        Alert.alert('Error in uploading', error.message);
        setLoading(false);
        return;
      }
    }
    await loadUser();
    setLoading(false);
  }

  return(
    <>
      <ImageBackground source={require('../../../assets/auth/bg.png')} contentFit='cover' className={`flex-1 bg-black`}>
        <View className={`w-full h-full justify-center items-center gap-10`}>
          <View className={`w-full justify-center items-center gap-1`}>
            <Text className={`text-white text-3xl font-josefinBold`}>Profile Picture</Text>
            <Text className={`text-[#F4AA35] text-2xl font-josefinMedium`}>Pick your best shot</Text>
          </View>
          <TouchableOpacity activeOpacity={0.85} onPress={()=>setOptionsVisible((prev) => !prev)} className={`w-[40vw] h-[40vw] rounded-full bg-white`}>
            <Image source={{ uri: uri }} placeholder={require('../../../assets/auth/profilePicPlaceholder.gif')} contentFit='cover' placeholderContentFit='cover' className={`flex-1 rounded-full`} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={onSubmit} className={`bg-white rounded-full items-center justify-center`}>
            <Text className={`px-14 py-4 text-black text-xl font-poppinsBold`}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <StatusBar style='light' hidden />
      <OptionsModal optionsVisible={optionsVisible} setOptionsVisible={setOptionsVisible} />
      <LoadingModal visible={loading} />
    </>
  );
}