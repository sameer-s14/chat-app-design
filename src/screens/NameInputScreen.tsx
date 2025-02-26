import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import { COLORS } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUpdateUserProfileMutation } from "../api";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../redux/authSlice";

const NameInputScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const dispatch = useDispatch();
  const handleSubmit = () => {
    try {
      const trimmedName = name.trim();
      updateUserProfile({ name: trimmedName }).unwrap();
      dispatch(updateUserDetails({ name: trimmedName }));
      navigation.navigate("Home");
    } catch (err) {
      console.log("ERROR OCCURED IN ", err);
    }
  };

  useEffect(() => {
    // Disable back navigation on Android
    const backAction = () => {
      return true; // Prevent default back action
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.header,
          { justifyContent: "space-between", width: "100%" },
        ]}
      >
        <Text style={styles.headerText}>Enter your name</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            {
              marginHorizontal: 10,
              backgroundColor: COLORS.PRIMARY,
              width: 50,
              height: 30,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            },
            !name.trim() && { opacity: 0.5 },
          ]}
        >
          <Ionicons name="checkmark-sharp" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    // backgroundColor: COLORS.WHITE,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 18,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.PRIMARY,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText: { fontSize: 16, fontWeight: "bold" },
});

export default NameInputScreen;
