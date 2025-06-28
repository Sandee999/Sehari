import { ActivityIndicator, Modal, View, useWindowDimensions } from "react-native";

export default function LoadingModal({ visible, color, bgColor }) {
  const { width, height } = useWindowDimensions();

  return (
    <Modal 
      visible={visible} 
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
      hardwareAccelerated={true}
      style={{ flex: 1 }}
    >
      <View className="w-full h-full justify-center items-center" style={{ backgroundColor: bgColor || '#FFFFFF66' }}>
        <ActivityIndicator size="large" color={color} />
      </View>
    </Modal>
  );
}