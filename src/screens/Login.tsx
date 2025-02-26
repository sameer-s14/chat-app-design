import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { COLORS } from "../constants";
import { CountryPicker } from "react-native-country-codes-picker";
import CountryCodeHeader from "../components/CountryCodeHeader";
import { isValidMobile } from "../utils";
import { useLoginWithPhoneMutation } from "../api";
import Loader from "../components/Loader";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const initialValues = { code: "+91", flag: "🇮🇳", name: "India" };
  const [countryCode, setCountryCode] = useState(initialValues);

  const [loginWithPhone, { isLoading }] = useLoginWithPhoneMutation();
  // Function to handle phone number input
  const handlePhoneChange = (text) => {
    const value = text.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(value);
  };
  
  const isValidPhoneNumber = isValidMobile(phoneNumber, countryCode?.code);

  async function handleLogin() {
    try {
      if (!isValidPhoneNumber) {
        console.log("❌ Invalid phone number");
      }
      setConfirmationVisible(false);
      const loginData = { phone: phoneNumber, countryCode:countryCode?.code }
      await loginWithPhone(loginData).unwrap();
      navigation.navigate("OtpVerification",loginData);
    } catch (err) {
      console.log(err)
      console.log('ERROR OCCURED IN', err)
    }
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      {/* Header Section */}
      <Text style={styles.header}>Verify Your Phone</Text>
      <Text style={styles.subheader}>
        Secure your account with a quick verification
      </Text>

      {/* Country Selector Modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.countrySelector}
      >
        <Text style={styles.countryText}>
          {countryCode.flag} {countryCode.name} ({countryCode?.code})
        </Text>
      </TouchableOpacity>

      {/* Phone Number Input */}
      <View style={styles.phoneInputContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.countryCode}>{countryCode?.code}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter phone number"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={() => setConfirmationVisible(true)}
        disabled={!isValidPhoneNumber}
        style={[
          styles.submitButton,
          !isValidPhoneNumber && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.submitText}>Continue</Text>
      </TouchableOpacity>

      {/* Terms and Conditions */}
      <Text style={styles.termsText}>
        By tapping Continue, you agree to the{" "}
        <Text style={styles.termsLink}>Terms of Service</Text>
      </Text>

      {/* Country Selection Modal */}

      <CountryPicker
        show={modalVisible}
        lang="en"
        inputPlaceholder="Search"
        searchMessage="No results"
        style={{ modal: { height: "80%" } }}
        onBackdropPress={() => setModalVisible(false)}
        pickerButtonOnPress={(item) => {
          setCountryCode({
            code: item?.dial_code,
            flag: item?.flag,
            name: item?.name?.en,
          });
          setModalVisible(false);
        }}
        ListHeaderComponent={CountryCodeHeader}
        popularCountries={["in", "sa", "qa"]}
      />

      {/* Mobile confirmation modal */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Is this your number correct?</Text>
            <Text style={styles.modalPhoneNumber}>
              ({countryCode?.code}) {phoneNumber}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmationVisible(false)}
                style={[styles.modalButton]}
              >
                <Text style={styles.modalButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogin}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6", // Light gray background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
  countrySelector: {
    backgroundColor: "#EDEFF1",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  countryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical:10,
    color: "#333",
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  termsLink: {
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalPhoneNumber: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  modalButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
