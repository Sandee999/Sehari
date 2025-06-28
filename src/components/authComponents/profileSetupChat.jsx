import { useRef } from "react";
import { FlatList, Text, View } from "react-native";

export default function ProfileSetupChat({data}) {
  const flatListRef = useRef(null);

  function renderItem({ item }) {
    return (
      <View className={`max-w-[80vw] rounded-3xl px-4 py-2 ${item.error ? 'bg-[#991b1bDD]' : 'bg-[#FFFFFFDD]'} ${item.user ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}`}>
        <Text className={`${item.error? 'text-white' : 'text-black'} text-lg font-poppinsMedium pt-1`}>{item.text}</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList 
        ref={flatListRef}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        className={`flex-1 w-full mb-4`} 
        contentContainerClassName={`mx-7 gap-4 flex-grow justify-end`} 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps='handled'
        scrollEnabled={true}
      />
    </>
  );
}