import React from 'react';
import { View, Image } from 'react-native';

const imageRows = [
  [
    require('../../assets/auth/1.jpg'),
    require('../../assets/auth/2.jpg'),
    require('../../assets/auth/3.jpg'),
  ],
  [
    require('../../assets/auth/4.jpg'),
    require('../../assets/auth/5.jpg'),
    require('../../assets/auth/6.jpg'),
  ],
  [
    require('../../assets/auth/3.jpg'),
    require('../../assets/auth/7.jpg'),
    require('../../assets/auth/8.jpg'),
  ],
];

export default function ImageGallery () {
  return (
    <>
      {imageRows.map((row, rowIndex) => (
        <View key={rowIndex} className="h-[20vh] flex-row justify-center items-center gap-4 -rotate-12">
          {row.map((imageSource, index) => (
            <Image
              key={index}
              source={imageSource}
              contentFit='cover'
              className={`w-[20vh] h-[20vh] rounded-[35px]`}
            />
          ))}
        </View>
      ))}
    </>
  );
};