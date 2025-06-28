import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalValues } from "../context/GlobalProvider";
import LoadingModal from "../components/loadingModal";

export default function NoInternet() {
  const { loadUser } = useGlobalValues();
  const [loading, setLoading] = useState(false)

  const onPress = async() => {
    setLoading(true);
    await loadUser().then(()=>setLoading(false));
  };

  return(
    <SafeAreaView>
      <View className="w-full h-full justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800">No Internet Connection</Text>
        <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-full" onPress={onPress} >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
      <LoadingModal visible={loading} color={'#3b82f6'} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}