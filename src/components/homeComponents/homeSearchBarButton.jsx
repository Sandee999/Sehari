import { Text, View, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function HomeSearchBarButton({ onPress }) {

  return(
    <TouchableWithoutFeedback onPress={onPress}>
      <View className={`w-[90vw] flex-row bg-white border-2 border-neutral-300 rounded-2xl`} style={{ height: 43 }}>
        <MaterialIcons name="search" size={24} color="#A3A3A3" style={{ width: 43, height: 43, paddingBottom: 2, textAlign: 'center', textAlignVertical: 'center' }} />
        <Text className='pt-1 flex-grow-[1] align-middle text-lg text-neutral-400 font-poppinsRegular'>Search for idlli with...</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}