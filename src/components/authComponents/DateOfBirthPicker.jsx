import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";


export default function DateOfBirthPicker({ value, setValue, placeholder, loading, onSubmit }) {
  const [date, setDate] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(date){
      // Format the date to YYYY-MM-DD
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getUTCDate()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}`;
      setValue(formattedDate);
    }
  },[date])

  return(
    <>
      <TouchableOpacity onPress={() => setShow(true)} disabled={loading} activeOpacity={0.8} className={`w-[70vw] h-[13vw] min-h-12 bg-[#FFFFFFEE] rounded-3xl justify-center items-center`}>
        <Text adjustsFontSizeToFit allowFontScaling numberOfLines={1} minimumFontScale={0.5} className={`text-xl font-semibold text-black p-4`}>{value? `My birth date is ${value}` : `${placeholder}`}</Text>
      </TouchableOpacity>
      {show && 
        <DateTimePicker 
          value={new Date((new Date()).setFullYear(new Date().getFullYear() - 20))} 
          mode="date" 
          onChange={(event, selectedDate) => {
            setShow(false);
            if(event.type === 'set') setDate(selectedDate);
          }} 
        />
      }
    </>  
  );
}