import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import getUserLocation from '../../../utils/location/getUserLocation';
import reverseGeocode from '../../../utils/location/reverseGeocode';
import { addPlace } from '../../../service/food';

function placeholerText(label) {
  switch (label) {
    case 'Place Name':
      return 'Enter Place Name';
    case 'Category':
      return 'Enter about the type of place it is ...';
    case 'Description':
      return 'Enter Description';
    case 'Location':
      return 'Enter latitude, longitude';
    case 'Opening Hours':
      return 'Enter the Opening Hours(e.g., 10AM - 9:30PM)';
    default:
      return 'Enter the text';
  }
}

function isValidLocation(text) {
  const locationPattern = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  return locationPattern.test(text);
}

function isValidOpeningHours(text) {
  const openingHoursPattern = /^((0?[1-9]|1[0-2])(:[0-5][0-9])?\s?(AM|PM))\s*-\s*((0?[1-9]|1[0-2])(:[0-5][0-9])?\s?(AM|PM))$/i;
  return openingHoursPattern.test(text);
}

function onChangeText(text, label, setInputs, setLocationError, setOpeningHoursError) {
  switch (label) {
    case 'Place Name':
      setInputs((prevInputs) => ({ ...prevInputs, 'Place Name': text }));
      break;
    case 'Category':
      setInputs((prevInputs) => ({ ...prevInputs, 'Category': text }));
      break;
    case 'Description':
      setInputs((prevInputs) => ({ ...prevInputs, 'Description': text }));
      break;
    case 'Location':
      if (isValidLocation(text)) setLocationError('');
      else setLocationError('Invalid Location');
      setInputs((prevInputs) => ({ ...prevInputs, 'Location': text }));
      break;
    case 'Opening Hours':
      if(isValidOpeningHours(text)) setOpeningHoursError('');
      else setOpeningHoursError('Invalid Opening Hours');

      setInputs((prevInputs) => ({ ...prevInputs, 'Opening Hours': text }));
      break;
  }
}

async function onGetLoc(setInputs) {
  const loc = await getUserLocation();
  setInputs((prevInputs) => ({ ...prevInputs, 'Location': `${loc.latitude}, ${loc.longitude}` }));
}

async function onSubmit(inputs) {
  try {
    let location = inputs['Location'].split(',').map(Number);
    const address = await reverseGeocode({ latitude: location[0], longitude: location[1] });
    const x = {
      place_name: inputs['Place Name'],
      place_type: inputs['Category'],
      place_description: inputs['Description'],
      place_address: address['formattedAddress'],
      place_location: `POINT(${location[1]} ${location[0]})`,
      place_opening_hours: inputs['Opening Hours'],
    };

    const { error } = await addPlace(x);
    if (error) Alert.alert(error)
    else router.back()
  } catch (error) {
    Alert.alert(error);
  }
}

export default function CreatorAddPlace() {
  const { id } = useLocalSearchParams();
  const labels = ['Place Name', 'Category', 'Description', 'Location', 'Opening Hours'];
  const insets = useSafeAreaInsets();

  const inputRefs = Array.from({ length: labels.length }, () => useRef(null));
  const [inputs, setInputs] = useState(Object.fromEntries(labels.map((label) => [label, ''])));
  const [locationError, setLocationError] = useState('');
  const [openingHoursError, setOpeningHoursError] = useState('');

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
          <Text className="flex-1 text-center text-white text-2xl font-poppinsMedium">Add Place</Text>
        </View>

        {labels.map((label, idx) => (
          <View key={idx} className="w-full px-5 mb-6">
            <Text className="text-white text-lg font-poppinsMedium">{label}</Text>
            <View 
              className={`w-full px-1 pt-1 mt-2 flex-row rounded-lg bg-[#333] border-[1px] ${((label === 'Opening Hours' && openingHoursError !== '') 
                || (label === 'Location' && locationError !== '')) ? 'border-[#991b1b]' : 'border-[#AAA]'}`
            }>
              <TextInput
                ref={inputRefs[idx]}
                className="flex-grow-[1] text-white font-poppinsMedium"
                placeholderTextColor="#AAA"
                placeholder={ placeholerText(label) }
                submitBehavior='blurAndSubmit'
                value={inputs[label]}
                onChangeText={text =>onChangeText(text, label, setInputs, setLocationError, setOpeningHoursError)}
              />
              {label=='Location' && 
                <TouchableOpacity onPress={async() => await onGetLoc(setInputs)} className={`items-center justify-center rounded-full ${locationError !== '' && 'bg-[#AAA]'}`} >
                  <Image 
                    source={require('../../../assets/home/gps.png')}
                    contentFit="contain"
                    className={`w-[20px] h-[20px] mx-5`}
                    tintColor={ locationError !== '' ? '#991b1b' : '#AAA'}
                  />
                </TouchableOpacity>
              }
            </View>
          </View>
        ))}

        <View className="w-full justify-center items-center px-5 mb-6">
          <TouchableOpacity onPress={() => onSubmit(inputs)} className="w-36 px-1 py-2 mt-2 rounded-lg bg-[#3b82f6]" >
            <Text className="text-center text-white text-lg font-poppinsMedium">Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <StatusBar style="light" hidden={false} />
    </>
  );
}
