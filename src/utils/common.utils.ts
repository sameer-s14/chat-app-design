import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";
import { BackHandler } from "react-native";

import * as FileSystem from "expo-file-system";

export const getFileUri = async (uri) => {
  if (uri.startsWith("content://")) {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.exists ? fileInfo.uri : null;
  }
  return uri; // Already in correct format
};

export function isValidMobile(phoneNumber: string, countryCode: string) {
  const phone = parsePhoneNumberFromString(`${countryCode} ${phoneNumber}`);
  return phone && phone.isValid() && phone.getType() === "MOBILE";
}


export function restrictBackHandler() {
  // Disable back navigation on Android
  const backAction = () => true;
  BackHandler.addEventListener("hardwareBackPress", backAction);

  return () => {
    BackHandler.removeEventListener("hardwareBackPress", backAction);
  };
}