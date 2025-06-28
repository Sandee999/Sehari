import { useState } from "react";
import CameraScreen from "../../../components/CameraScreen";
import { router } from "expo-router";

export default function ProfilePicCamera() {
  const [uri, setUri] = useState(null);

  return <CameraScreen 
    mode="photo" 
    ratio='4:3' 
    defaultFacing="front" 
    cachefilename="pfp.jpg" 
    navFunction={()=>router.replace('/register/profilePic/imageEdit')} 
  />
}