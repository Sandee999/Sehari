import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { getProfileByUsername, createProfile, updateProfile } from '../../service/profile'
import Animated, { useAnimatedKeyboard, useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGlobalValues } from "../../context/GlobalProvider";
import DateOfBirthPicker from "./DateOfBirthPicker";

function placeholder(currentInput){
  switch (currentInput) {
    case 'username':
      return 'Pick a cool username';
    case 'name':
      return 'Enter your Full Name';
    case 'DOB':
      return 'Pick your Date of Birth';
    case 'taste':
      return 'Describe your taste';
    default:
      return 'Done!';
  }
}

async function checkUsername(username, id) {
  if(username.includes(' ')) return 'Username cannot have spaces.';
  const { data, error } = await getProfileByUsername(username);
  if(data) {
    return 'Username is already taken, try a different one.';
  }
  else if(error.code==='PGRST116') {
    const{ data, error } = await createProfile(id, username);
    if(error){
      return 'An Error has Occurred, try again.';
    }
    return 'Username is available!';
  }
  else {
    return 'Check your internet connection, and try again.';
  }
}

const setProfile = async (id, user) => {
  const { data, error } = await updateProfile(id, user);
  if(error){
    router.replace('/noInternet/register');
  }
  if(data){
    router.replace('/register/profilePic');
  }
}

export default function ProfileSetupChatTextBox({user, setUser, setChatData}) {
  const insets = useSafeAreaInsets();
  const marginBottom = useSharedValue(insets.bottom);
  const keyboard = useAnimatedKeyboard();
  useAnimatedReaction(()=>keyboard.state.value, (currentValue) => marginBottom.value = currentValue === 1 || currentValue === 2 ? 0 : insets.bottom);
  const [value, setValue] = useState('');
  const [currentInput, setCurrentInput] = useState('username');
  const [loading, setLoading] = useState(false);

  const { userData } = useGlobalValues();

  useEffect(() => {
    if(userData?.username) {
      setCurrentInput('name');
      setChatData(prev => [...prev, { text: `Complete your Profile`, user: false, error: false }]);
      setChatData(prev => [...prev, { text: `Your username is ${userData?.username}`, user: false, error: false }]);
      setChatData(prev => [...prev, { text: `What's your Full Name?`, user: false, error: false }]);
    } else {
      setCurrentInput('username');
      setChatData(prev => [...prev, { text: `Let’s set up your profile!`, user: false, error: false }]);
      setChatData(prev => [...prev, { text: `Pick a cool username`, user: false, error: false }]);
    }
  },[]);

  const onSubmit = async () => {
    if(loading) return;
    setLoading(true);

    if(value.trim() === '' && currentInput !== 'taste') {
      setChatData(prev => [...prev, { text: `The ${currentInput} cannot be empty.`, user: false, error: true }]);
      setLoading(false);
      return;
    }

    switch (currentInput) {
      case 'username':
        setChatData(prev => [...prev, { text: `My username is ${value}`, user: true, error: false }]);
        setChatData(prev => [...prev, { text: `Checking if ${value} is available...`, user: false, error: false }]);
        const response = await checkUsername(value, userData.id);
        if(response==='Username is available!') {
          setChatData(prev => [...prev, { text: response, user: false, error: false }]);
          setCurrentInput('name');
          setValue('');
          setChatData(prev => [...prev, { text: `What's your Full Name?`, user: false, error: false }]);
        }
        else if(response==='Username is already taken, try a different one.') {
          setChatData(prev => [...prev, { text: response, user: false, error: true }]);
          setValue('');
        }
        else {
          setChatData(prev => [...prev, { text: response, user: false, error: true }]);
          setValue('');
        }
        break;
      case 'name':
        setChatData(prev => [...prev, { text: `My name is ${value}`, user: true, error: false }]);
        setUser(prev => ({ ...prev, name: value }));
        setCurrentInput('DOB');
        setValue('');
        setChatData(prev => [...prev, { text: `What's your birth date?`, user: false, error: false }]);
        break;
      case 'DOB':
        setChatData(prev => [...prev, { text: `My birth date is ${value}`, user: true, error: false }]);
        setUser(prev => ({ ...prev, DOB: value }));
        setCurrentInput('taste');
        setValue('');
        setChatData(prev => [...prev, { text: `What do you crave? (in 100 characters)`, user: false, error: false }]);
        break;
      case 'taste':
        if(value) setChatData(prev => [...prev, { text: `My flavors: ❝${value}❞`, user: true, error: false }]);
        setUser(prev => ({ ...prev, taste: value }));
        setCurrentInput('done');
        setValue('');
        setChatData(prev => [...prev, { text: `Done!`, user: false, error: false }]);
        break;
    }

    setLoading(false);
  }

  // Submit the profile data to the database
  useEffect(() => {
    if(currentInput==='done') {
      setProfile(userData.id, user);
    }
  },[currentInput]);

  return (
    <>
      <Animated.View className={`w-[100vw] min-h-[10vh] z-30 flex-row items-center justify-evenly`} style={{ marginBottom: marginBottom }}>
        {currentInput!=='DOB' ?
          <TextInput 
            className={`w-[70vw] h-auto py-4 px-5 text-xl font-semibold bg-[#FFFFFFEE] rounded-3xl`}
            placeholder={placeholder(currentInput)}
            placeholderTextColor="#000000AA"
            value={value}
            onChangeText={setValue}
            onSubmitEditing={!loading ? onSubmit : null}
            editable={!loading || currentInput!=='done' || currentInput!=='DOB'}
            autoCapitalize={currentInput==='name' ? 'words' : currentInput==='taste' ? 'sentences' : 'none'}
            autoCorrect={currentInput==='taste'}
            autoComplete={currentInput==='username' ? 'username' : currentInput==='name' ? 'name' : currentInput==='DOB' ? 'birthdate-full' : 'none'}
            maxLength={currentInput==='username' ? 20 : currentInput==='name' ? 50 : currentInput==='DOB' ? 10 : 100}
            multiline={currentInput==='taste'}
            numberOfLines={currentInput==='taste' ? 4 : 1}
          />
          : 
          <DateOfBirthPicker value={value} setValue={setValue} placeholder={placeholder(currentInput)} loading={loading} onSubmit={onSubmit} />
        }
        <TouchableOpacity onPress={onSubmit} disabled={loading} activeOpacity={0.8} className={`w-[13vw] h-[13vw] justify-center items-center bg-[#FFFFFFEE] rounded-3xl`}>
          <Text className={`text-3xl text-black`}>{'➤'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}