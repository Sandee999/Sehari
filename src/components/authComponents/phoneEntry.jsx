import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Platform, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, Alert } from "react-native";
import { signInWithPhone } from "../../service/auth";
import LoadingModal from "../loadingModal";

export default function PhoneEntry() {
  const [submiting, setSubmiting ] = useState(false);
  const [phoneNoEntry, setPhoneNoEntry] = useState(0);
  const [phoneNoError, setPhoneNoError] = useState(false);
  const disableSubmitCondition = String(phoneNoEntry).length !== 10 || phoneNoError || submiting;

  useEffect(() => {
    function checkPhoneNo() {
      if (Number.isSafeInteger(phoneNoEntry) && phoneNoEntry >= 0) setPhoneNoError(false);
      else setPhoneNoError(true);
    }
    checkPhoneNo();
  }, [phoneNoEntry]);

  function onChangeText(text) {
    setPhoneNoEntry(Number(text));
  }

  async function submit() {
    Keyboard.dismiss();
    if (disableSubmitCondition) return;
    setSubmiting(true);
    
    // Sign In with Phone No.
    const { data, error } = await signInWithPhone(`+91${phoneNoEntry}`);

    // Error Handling
    if(error) {
      Alert.alert("Error", error.message);
      setSubmiting(false)
      return;
    }

    router.push({
      pathname: '/login/verify',
      params: { phone: `+91${phoneNoEntry}` },
    });
    setTimeout(() => setSubmiting(false), 2000);
  }

  return(
    <>
      <KeyboardAvoidingView behavior='position'>
        <View className={`w-full h-[30vh] justify-center items-center`}>
          <Text className={`font-poppinsSemiBold text-lg text-white`}>Log in or sign up</Text>
          <View className={`w-[80vw] h-[7vh] flex-row bg-[#222] rounded-3xl my-4 text-white border-[1px] ${phoneNoError ? 'border-red-700' : 'border-[#FFFFFFDD]'}`}>
            <Text className={`w-[15vw] h-full align-middle text-center text-white text-lg font-poppinsSemiBold pt-1`}>+91</Text>
            <TextInput 
              className={`w-[65vw] h-full text-white text-left text-base font-poppinsRegular mt-1`}
              placeholder='Enter your Mobile Number'
              placeholderTextColor={'#FFFFFF99'}
              onChangeText={onChangeText}
              keyboardType='phone-pad'
              autoComplete={(Platform.OS == 'android') ? 'tel-device' : 'tel'}
              maxLength={10}
              numberOfLines={1}
              onSubmitEditing={submit}
              cursorColor={'#FFFFFF99'}
            />
          </View>
          <TouchableOpacity 
            className={`w-[80vw] h-[7vh] items-center justify-center rounded-3xl my-2 ${disableSubmitCondition ? 'bg-[#FFFFFFAA]' : 'bg-white'}`}
            onPress={submit} 
            activeOpacity={.9} 
            disabled={disableSubmitCondition} 
          >
            <Text className={`font-poppinsSemiBold text-[#000000B2] pt-1`}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <LoadingModal visible={submiting} color={'#FF6F00'} bgColor={'#00000099'} />
    </>
  );
}