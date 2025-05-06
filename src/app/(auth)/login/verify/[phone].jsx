import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, Keyboard, KeyboardAvoidingView, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OtpEntry from '../../../../components/authComponents/otpEntry';
import { router, useLocalSearchParams } from 'expo-router';
import { signInWithPhone, verifyPhone } from '../../../../service/auth';
import LoadingModal from '../../../../components/loadingModal';
import { useGlobalValues } from '../../../../context/GlobalProvider';
import checkUser from '../../../../utils/checkUser';

async function resendOTP(phone, setLoading) {
  setLoading(true);
  const { data, error } = await signInWithPhone(phone);

  if (error) {
    Alert.alert("Error", error.message);
  }
  setLoading(false);
}

// async function checkUser(loadUser) {
//   const { data, error } = await loadUser();
//   if(error?.name === 'AuthSessionMissingError' || error?.name === 'AuthApiError'){
//     router.dismissTo('/login');
//     return;
//   }
//   else if(error?.code==='PGRST116'){
//     router.dismissTo('/register');
//     return;
//   }
//   else if(!data) {
//     router.dismissTo('/noInternet/root');
//     return;
//   }else {
//     const hasNull = Object.values(data).some((value) => value === null);
//     if (hasNull) {
//       router.dismissTo('/register');
//       return;
//     }
//     router.dismissTo('/home');
//   }
// }

export default function Verify() {
  const { phone } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array.from({length:6},()=>''));
  const [otpError, setOtpError] = useState('');
  const disableSubmitCondition = otpError !== '';

  const { loadUser } = useGlobalValues();
  async function submit() {
    setLoading(true);
    setOtpError('');
    let enteredOtp = otp.join('');

    if(enteredOtp.length !== 6) {
      setOtpError('Invalid OTP');
      setLoading(false);
      return;
    }

    // Verify Phone No.
    const { data, error } = await verifyPhone(phone, enteredOtp);

    if (error) {
      setOtpError(error.message.replace('Token'||'token', 'OTP'));
      setLoading(false);
      return;
    }

    Keyboard.dismiss();
    await checkUser(loadUser).then((value)=>{
      router.push(value);
      setLoading(false);
    });
  }

  return (
    <>
      <SafeAreaView className='w-full h-full items-center justify-start bg-[#000000]'>
        <View className={`w-full absolute top-[25vh] justify-center items-center`}>
          <OtpEntry otp={otp} setOtp={setOtp} submit={submit} otpError={otpError} setOtpError={setOtpError} />
          <Text className={`mt-5 text-center font-poppinsRegular text-sm text-white`}>
            {'Didn\'t receive the OTP?  '}
            <Text onPress={() => resendOTP(phone, setLoading)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} className={`mx-2 text-[#FFA500] text-base underline`}>Resend OTP</Text>
          </Text>
        </View>
        <KeyboardAvoidingView behavior='height' className={`w-full mb-9 absolute bottom-0 justify-start items-center`}>
          <TouchableOpacity 
            className={`w-[60vw] h-[7vh] items-center justify-center rounded-3xl my-2 bg-black border-[1px] border-white`}
            activeOpacity={.9} 
            disabled={disableSubmitCondition}
            onPress={submit} 
          >
            <Text className={`text-white font-poppinsMedium text-2xl pt-1`}>Continue</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar animated backgroundColor='transparent' style='light' hidden={false} />
      <LoadingModal visible={loading} color={'#FFA500'} />
    </>
  );
}