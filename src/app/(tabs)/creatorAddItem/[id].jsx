import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image } from 'expo-image';
import { addItem } from '../../../service/food';

function placeholderText(label) {
  switch (label) {
    case 'Item Name':
      return 'Enter Item Name';
    case 'Item Price':
      return 'Enter price (e.g., 12.50)';
    default:
      return 'Enter value';
  }
}

function onChangeText(text, label, setInputs, setPriceError) {
  switch (label) {
    case 'Item Name':
      setInputs((prevInputs) => ({ ...prevInputs, 'Item Name': text }));
      break;
    case 'Item Price':
      if (Number(text) > 0) setPriceError('');
      else setPriceError('Invalid Price');
      setInputs((prevInputs) => ({ ...prevInputs, 'Item Price': Number(text) }));
      break;
  }
}

async function onSubmit(inputs, id) {
  try {
    const item_name = inputs['Item Name'];
    const item_price = parseFloat(inputs['Item Price']);
    const place_id = id.toString();

    if (item_name.split('').length <= 0 || item_price <= 0 || Number.isNaN(item_price)) {
      Alert.alert('Invalid Input', 'Please enter a valid item name and price.');
      return;
    }

    const { error } = await addItem({ item_name, item_price, place_id });
    if (error) Alert.alert('Insert Error', error.message);    
    else router.back();
  } catch (err) {
    Alert.alert('Unexpected Error', err.message || String(err));
  }
}

export default function CreatorAddItem() {
  const { id } = useLocalSearchParams();
  const labels = ['Item Name', 'Item Price'];
  const insets = useSafeAreaInsets();
  
  const inputRefs = Array.from({ length: labels.length }, () => useRef(null));
  const [inputs, setInputs] = useState(Object.fromEntries(labels.map((label) => [label, ''])));
  const [priceError, setPriceError] = useState('');
  
  return (
    <>
      <KeyboardAwareScrollView
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
        className="bg-black"
        extraScrollHeight={100}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full px-5 py-5 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={require('../../../assets/home/backArrow.png')} contentFit="contain" className="w-[20px] h-[20px]"/>
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-2xl font-poppinsMedium">Add Item</Text>
        </View>
        
        {labels.map((label, idx) => (
          <View key={idx} className="w-full px-5 mb-6">
            <Text className="text-white text-lg font-poppinsMedium">{label}</Text>
            <View 
              className={`w-full px-1 pt-1 mt-2 flex-row rounded-lg bg-[#333] border-[1px] border-[#AAA] ${label=='Item Price' && priceError && 'border-red-500'}`
            }>
              <TextInput
                ref={inputRefs[idx]}
                className="flex-grow-[1] text-white font-poppinsMedium"
                placeholderTextColor="#AAA"
                placeholder={ placeholderText(label) }
                submitBehavior='blurAndSubmit'
                value={inputs[label]}
                onChangeText={text =>onChangeText(text, label, setInputs, setPriceError)}
              />
            </View>
          </View>
        ))}
        
        <View className="w-full justify-center items-center px-5 mb-6">
          <TouchableOpacity onPress={() => onSubmit(inputs, id)} className="w-36 px-1 py-2 mt-2 rounded-lg bg-[#3b82f6]" >
            <Text className="text-center text-white text-lg font-poppinsMedium">Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </>
  )
}