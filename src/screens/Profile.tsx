import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Header";
import { useUpdateUserProfileMutation } from "../api";
import { ms } from "../utils";
import { COLORS } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../redux/authSlice";
import CommonBottomSheet from "../components/CommonBottomSheet";
import { Alert } from "react-native";

export default function ProfileScreen({ navigation }) {
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [newName, setNewName] = useState(user?.name);
  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);

  // Show Modal to edit name
  const openDetailBottomSheet = () => {
    bottomSheetRef.current?.expand();
    inputRef.current?.focus();
  };

  const closeBottomSheet = () => {
    Keyboard.dismiss()
    bottomSheetRef.current?.close();
  };

  // Save the new name and close modal
  const saveNewName = () => {
    handleSubmit({ name: newName })
    closeBottomSheet();
  };
  const handleSubmit = async ({ image, name } = {}) => {
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
      }
      if (name && user?.name !== name) {
        formData?.append('name', name);
      }
      if (formData?._parts?.length) {
        const { data: response } = await updateUserProfile(formData).unwrap();
        setImage(null);
        dispatch(updateUserDetails({ name: response?.name, profile: response?.profile || "" }));
      }
      // navigation.navigate("Home");
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
      setImage(pickerResult.assets[0]);

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

  // async function selectImage(image) {
  //   try {
  //     setImage(image)
  //     handleSubmit({ image });
  //   } catch (err) {
  //     console.log("ERROR IN ULPOADIND");
  //   }
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Header heading={"Profile"} backHandler={() => navigation.goBack()} borderBottomWidth={0} />

      {/* Profile Picture */}
      <TouchableOpacity style={styles.profileContainer}>
        {image ? (
          <Image source={{ uri: image?.uri }} style={styles.profileImage} />
        ) : user?.profile ? <Image source={{ uri: user?.profile }} style={styles.profileImage} /> : (
          <View style={styles.defaultProfile}>
            <FontAwesome6
              name="user-large"
              size={ms(120)}
              color={COLORS.WHITE}
            />
          </View>
        )}
        {/* <FilePicker containerStyle={styles.cameraIcon} setFiles={selectImage}>
          <MaterialCommunityIcons name="camera-outline" size={24} color={COLORS.WHITE} />
        </FilePicker> */}
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <MaterialCommunityIcons name="camera-outline" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* User Details */}
      <View style={styles.infoContainer}>
        {/* Name Field with Modal */}
        <TouchableOpacity style={styles.fieldContainer} onPress={openDetailBottomSheet}>
          <View style={{ marginHorizontal: 15 }}>
            <FontAwesome5 name="user" size={18} color={COLORS.DARK_SLATE_GRAY} />
          </View>
          <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldTitle}>Name</Text>
            <Text style={styles.fieldValue}>{user?.name}</Text>
          </View>
        </TouchableOpacity>

        {/* About Field */}
        <TouchableOpacity style={styles.fieldContainer} onPress={() => navigation.navigate('About')}>
          <View style={{ marginHorizontal: 15 }}>
            <Feather name="info" size={18} color={COLORS.DARK_SLATE_GRAY} />
          </View>
          <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldTitle}>About</Text>
            <Text style={styles.fieldValue}>{user?.bio || ''}</Text>
          </View>
        </TouchableOpacity>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <View style={{ marginHorizontal: 15 }}>
            <Feather name="phone" size={18} color={COLORS.DARK_SLATE_GRAY} />
          </View>
          <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldTitle}>Phone</Text>
            <Text style={styles.fieldValue}>{user?.countryCode || '' + ' ' + user?.phone}</Text>
          </View>
        </View>
      </View>

      {/* Bootom Sheet */}
      <CommonBottomSheet bottomSheetRef={bottomSheetRef} closeBottomSheet={closeBottomSheet}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.modalInput}
                value={newName}
                autoFocus={true}
                onChangeText={(text) => text.length <= 25 && setNewName(text)}
                placeholder="Enter your name"
                maxLength={25}
                selectionColor={COLORS.PRIMARY}
              />
              {newName?.length > 0 && <Text style={styles.charCount}>{25 - newName?.length}</Text>}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={closeBottomSheet} >
                <Text style={styles?.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveNewName} >
                <Text style={styles?.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </CommonBottomSheet>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  cameraIcon: { position: 'absolute', backgroundColor: COLORS.PRIMARY, height: ms(45), width: ms(45), justifyContent: 'center', alignItems: 'center', borderRadius: 20, bottom: 0, right: 0, borderColor: "#f9f9f9", borderWidth: 3 },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  profileImage: {
    width: ms(170),
    height: ms(170),
    borderRadius: ms(85),
    borderWidth: 2,
    borderColor: COLORS.DARK_SLATE_GRAY
  },
  defaultProfile: {
    width: ms(170),
    height: ms(170),
    overflow: "hidden",
    borderRadius: ms(85),
    paddingTop: ms(50),
    backgroundColor: "#B0BEC5",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 15,
    width: "100%",
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  fieldTextContainer: {
    marginStart: 10,
  },
  fieldTitle: {
    fontWeight: "400",
    fontSize: 16,
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.DARK_SLATE_GRAY,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalInput: {
    width: "95%",
    fontSize: 18,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomColor: COLORS.PRIMARY,
    borderBottomWidth: 2,
  },
  charCount: {
    fontSize: 14,
    color: "#888",
  },
  modalButtons: {
    flexDirection: "row",
    width: "40%",
    marginVertical: 20,
    alignSelf: "flex-end",
    justifyContent: "space-between",
  },
  buttonText: { color: COLORS.PRIMARY, fontWeight: 600, padding: 10, }
});
