import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalValues } from "../../context/GlobalProvider";

export default function NoInternet() {
  const { address } = useLocalSearchParams();
  const { loadUser } = useGlobalValues();

  async function onPress() {
    if(address!=='root'){
      router.replace(`/${address}`);
      return;
    }
    router.replace('/')
  }

  return (
    <>
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <View className="w-full h-full justify-center items-center">
          <Text className="text-2xl font-bold text-gray-800">No Internet Connection</Text>
          <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-full" onPress={onPress}>
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" backgroundColor="white" />
    </>
  );
}