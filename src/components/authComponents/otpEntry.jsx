import { useRef } from "react";
import { Text, TextInput, View } from "react-native";

export default function OtpEntry({ otp, setOtp, otpError, setOtpError, submit }) {
  // Refs for the OTP input fields
  const otpRefs = Array.from({ length: otp.length }, () => useRef());

  const onChangeText = (text, index) => {
    setOtp(prevOtp => {
      let newOtp = [...prevOtp];
      newOtp[index] = text.replace(/[^0-9]/g, ''); // Allow only numbers
      return newOtp;
    });
    setOtpError('');
  }

  // Handles Focus on Text Inputs
  const handleKeysPress = ({ key }, index) => {
    if (index !== 0 && key === 'Backspace' && !otp[index]) {
      otpRefs[index - 1].current?.focus();
    }
    if (index !== otp.length - 1 && key !== 'Backspace') {
      otpRefs[index + 1].current?.focus();
    }
  }

  return (
    <>
      <Text className={`font-poppinsSemiBold text-lg text-white`}>Enter the OTP</Text>
      <View className={`w-[80vw] h-[7vh] flex-row my-4 justify-between`}>
        {otp.map((_, index) => (
          <TextInput
            key={index}
            value={otp[index]}
            ref={otpRefs[index]}
            textAlign='center'
            className={`w-[12vw] px-[4vw] bg-black rounded-2xl align-middle text-white font-poppinsBold border-[1.5px] ${otpError!=='' ? 'border-red-700' : 'border-white'} text-lg`}
            keyboardType='number-pad'
            placeholder='x'
            placeholderTextColor={'#FFFFFF'}
            cursorColor={'#FFFFFF'}
            maxLength={1}
            autoFocus={index === 0}
            onChangeText={(text)=>onChangeText(text, index)}
            onKeyPress={({ nativeEvent })=>handleKeysPress(nativeEvent, index)}
            onSubmitEditing={ index===otp.length-1 ? submit : ()=>otpRefs[index + 1].current?.focus()}
          />
        ))}
      </View>
      <Text className={`font-poppinsRegular text-sm text-red-700`}>{otpError}</Text>
    </>
  );
}