import { useState } from 'react';
import { View, Text, Modal, TouchableHighlight } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { setUserRating } from '../../service/userData';

export default function RatingModel({ modelVisible, toggleModelVisible, user_id, item_id, setReviews }) {
  const [rating, setRating] = useState('');

  function handleBackPress() {
    setRating('');
    toggleModelVisible();
  }

  async function handleConfirmPress() {
    const { data, error } = await setUserRating(user_id, item_id, rating);
    if(error) {
      Alert.alert('Error', 'Failed to submit the rating.');
      toggleModelVisible();
      return;
    }
    
    setReviews(prev => {
      const updated = prev.filter(item => item.user_id !== user_id);
      return [data, ...updated];
    });
    toggleModelVisible();
  }

  return (
    <Modal 
      visible={modelVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={toggleModelVisible}
      hardwareAccelerated={true}
      style={{ flex: 1 }}
    >
      <View className="w-full h-full justify-center items-center bg-[#00000099]">
        <View className="w-[300px] h-[250px] bg-white rounded-lg items-center justify-around">
          <Text className="text-black text-2xl font-poppinsBlack tracking-wide">Rating</Text>
          <StarRating 
            rating={rating}
            onChange={setRating}
            starCount={5}
            starSize={25}
            color="#F4AA35"
            emptyColor="#AAA"
          />
          <View className="w-full flex-row items-center justify-evenly">
            <TouchableHighlight underlayColor="#DDD" onPress={handleBackPress}>
              <Text className="p-4 text-black text-lg font-poppinsMedium">Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="#DDD" onPress={handleConfirmPress}>
              <Text className="p-4 text-[#F4AA35] text-lg font-poppinsMedium">Submit</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
}