import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CountryPicker } from "react-native-country-codes-picker";
import CountryCodeHeader from "../components/CountryCodeHeader";
import { isValidMobile } from "../utils";
import { useLoginWithPhoneMutation } from "../api";
import { useTranslation } from "react-i18next";
import { COLORS } from "../constants";

const Login = ({ navigation }) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [error, setError] = useState("");
  const initialValues = { code: "+91", flag: "🇮🇳", name: "India" };
  const [countryCode, setCountryCode] = useState(initialValues);
  const [loginWithPhone, { isLoading }] = useLoginWithPhoneMutation();
  const buttonScale = new Animated.Value(1);

  const isValidPhoneNumber = isValidMobile(phoneNumber, countryCode?.code);

  // Handle phone number input
  const handlePhoneChange = (text) => {
    const value = text.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(value);
    setError(""); // Clear error on input change
  };

  // Button press animation
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle login submission
  const handleLogin = async () => {
    setConfirmationVisible(false)
    if (!isValidPhoneNumber) {
      setError(t("INVALID_PHONE_NUMBER"));
      return;
    }

    try {
      const loginData = { phone: phoneNumber, countryCode: countryCode?.code };
      await loginWithPhone(loginData).unwrap();
      navigation.navigate("OtpVerification", loginData);
    } catch (err) {
      setError(t("LOGIN_ERROR"));
      console.error("Login Error:", err);
    } finally {
      setConfirmationVisible(false);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.PRIMARY, COLORS.SECONDARY]} // Gradient background
      style={styles.container}
    >
      {/* Header Section */}
      <Text style={styles.header}>{t("VERIFY_PHONE")}</Text>
      <Text style={styles.subheader}>{t("VERIFY_PHONE_SUBTEXT")}</Text>

      {/* Country Selector */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.countrySelector}
      >
        <Text style={styles.countryText}>
          {countryCode.flag} {countryCode.name} ({countryCode?.code})
        </Text>
      </TouchableOpacity>

      {/* Phone Number Input */}
      <View
        style={[
          styles.phoneInputContainer,
          error && { borderColor: COLORS.ERROR },
        ]}
      >
        <Icon name="phone" size={20} color={COLORS.SECONDARY} style={styles.icon} />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.countryCode}>{countryCode?.code}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.phoneInput}
          placeholder={t("ENTER_PHONE")}
          placeholderTextColor={COLORS.TEXT_LIGHT}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          maxLength={15}
        />
      </View>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Submit Button */}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          onPress={() => {
            animateButton();
            setConfirmationVisible(true);
          }}
          disabled={!isValidPhoneNumber || isLoading}
          style={[
            styles.submitButton,
            (!isValidPhoneNumber || isLoading) && { opacity: 0.7 },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.submitText}>{t("CONTINUE")}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Terms and Conditions */}
      <View style={styles.termsContainer}>
        <Icon name="info" size={16} color={COLORS.SUCCESS} style={styles.termsIcon} />
        <Text style={styles.termsText}>
          {t("TERMS_TEXT") + " "}
          <Text style={styles.termsLink}>{t("TERMS_SERVICE")}</Text>
        </Text>
      </View>

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

      {/* Confirmation Modal */}
      <Modal
        visible={confirmationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t("CONFIRM_NUMBER")}</Text>
            <Text style={styles.modalPhoneNumber}>
              ({countryCode?.code}) {phoneNumber}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setConfirmationVisible(false)}
                style={styles.modalButton}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.SUCCESS }]}>{t("EDIT")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.modalButton, styles.verifyButton]}
              >
                <Text style={styles.modalButtonText}>{t("VERIFY")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 30,
  },
  countrySelector: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  countryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: COLORS.TEXT_DARK,
  },
  submitButton: {
    backgroundColor: COLORS.ACCENT, // Green for the Continue button
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 14,
    marginTop: 10,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: COLORS.WHITE,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalPhoneNumber: {
    fontSize: 16,
    color: COLORS.TEXT_DARK,
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
  verifyButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  modalButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Light background
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border
  },
  termsIcon: {
    marginRight: 10,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.WHITE, // White text for better contrast
    textAlign: "center",
  },
  termsLink: {
    color: COLORS.ACCENT, // Green for the link
    fontWeight: "bold",
  },
});

export default Login;