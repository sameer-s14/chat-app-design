import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Header";
import { useUpdateUserProfileMutation } from "../api";
import { ms } from "../utils";
import { COLORS } from "../constants";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { user } = useSelector((state) => state?.auth);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("John Doe");

  // Function to pick an image
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
    }
  };

  // Show Modal to edit name
  const openNameModal = () => {
    setModalVisible(true);
  };

  // Close Modal without saving
  const closeModal = () => {
    setModalVisible(false);
  };

  // Save the new name and close modal
  const saveNewName = () => {
    setModalVisible(false);
    // Here you would usually update the profile using your API or local state
    console.log("Saved Name: ", newName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header heading={"Profile"} backHandler={() => navigation.goBack()} />

      {/* Profile Picture */}
      <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image?.uri }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultProfile}>
            <FontAwesome6
              name="user-large"
              size={ms(150)}
              color={COLORS.PALE_GRAY}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* User Details */}
      <View style={styles.infoContainer}>
        {/* Name Field with Modal */}
        <TouchableOpacity style={styles.fieldContainer} onPress={openNameModal}>
          <EvilIcons name="user" size={35} color={COLORS.DARK_SLATE_GRAY} />
          <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldTitle}>Name</Text>
            <Text style={styles.fieldValue}>{user?.name}</Text>
          </View>
        </TouchableOpacity>

        {/* About Field */}
        <View style={styles.fieldContainer}>
          <Feather name="info" size={24} color={COLORS.DARK_SLATE_GRAY} />
          <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldTitle}>About</Text>
            <Text style={styles.fieldValue}>{user?.about || ''}</Text>
          </View>
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <Feather name="phone" size={24} color={COLORS.DARK_SLATE_GRAY} />
          <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldTitle}>Phone</Text>
            <Text style={styles.fieldValue}>+91 9876543210</Text>
          </View>
        </View>
      </View>

      {/* Modal for Name Edit */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Your Name</Text>
              <TextInput
                style={styles.modalInput}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your name"
                autoFocus={true}
              />
              <View style={styles.modalButtons}>
                <Button title="Save" onPress={saveNewName} />
                <Button title="Cancel" onPress={closeModal} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  profileImage: {
    width: ms(200),
    height: ms(200),
    borderRadius: ms(100),
  },
  defaultProfile: {
    width: ms(200),
    height: ms(200),
    overflow: "hidden",
    borderRadius: ms(100),
    paddingTop: ms(50),
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
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
    fontWeight: "500",
    fontSize: 18,
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.DARK_SLATE_GRAY,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
