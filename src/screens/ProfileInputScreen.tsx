import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Image,
  Alert,
} from "react-native";
import { COLORS } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateUserProfileMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../redux/authSlice";
import Loader from "../components/Loader";
import { Platform } from "react-native";
import { restrictBackHandler } from "../utils";
import { FilePicker } from "../components/FilePicker";
import * as ImagePicker from "expo-image-picker";

const ProfileInputScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state?.auth);
  const [profileImage, setProfileImage] = useState(null);
  const [updateUserProfile, { isLoading, data, isError }] = useUpdateUserProfileMutation();
  const dispatch = useDispatch();

  const handleSubmit = async ({ image } = {}) => {
    try {
      const formData = new FormData();
      if (image) {
        const adjustedUri =
          Platform.OS === 'android' ? image?.uri : image?.uri.replace('file://', '');
        formData.append("file", {
          uri: adjustedUri,
          name: image.name || "upload.jpg",
          type: image.mimeType || "image/jpeg",
        } as any);
        const { data: response } = await updateUserProfile(formData).unwrap();
        setProfileImage(null);
        dispatch(updateUserDetails({ name: response?.name, profile: response?.profile || "" }));
        navigation.navigate("Home");
      }

    } catch (err) {
      console.log("ERROR OCCURED IN ", err);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "You need to grant camera roll access to change your profile picture."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (pickerResult.assets[0]) {
      setProfileImage(pickerResult.assets[0]);

      const formdata = new FormData();
      formdata.append("file", {
        uri: pickerResult.assets[0].uri,
        name: "image.jpg",
        type: "image/jpg",
      });
      updateUserProfile(formdata);
      handleSubmit({
        image: {
          uri: pickerResult.assets[0].uri,
          name: "image.jpg",
          type: "image/jpg",
        }
      })
    }
  };


  useEffect(restrictBackHandler, []);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <View style={[styles.header, { justifyContent: "space-between", width: "100%" }]}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Ionicons name="checkmark-sharp" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>

      {/* Profile Image Picker */}
      <TouchableOpacity style={styles.profileContainer} onPress={pickImage} >
        {user?.profile || profileImage ? (
          <Image source={{ uri: profileImage?.uri || user?.profile }} style={styles.profileImage} />
        ) : (
          <Ionicons name="camera" size={50} color={COLORS.DARK_SLATE_GRAY} />
        )}
      </TouchableOpacity>
      <Text style={styles.text}>Tap to change profile picture</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    marginHorizontal: 10,
    backgroundColor: COLORS.PRIMARY,
    width: 50,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    backgroundColor: COLORS.SOFT_GRAY,
    borderRadius: 60,
    width: 120,
    height: 120,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});

export default ProfileInputScreen;
