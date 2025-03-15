import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ActivityIndicator, Image, SectionList, StyleSheet, Text, Animated, Easing, Vibration } from "react-native";
import { COLORS } from "../constants";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { CountryPicker } from "react-native-country-codes-picker";
import CountryCodeHeader from "../components/CountryCodeHeader";
import { useAddUserContactMutation } from "../api";
import { isValidMobile } from "../utils";
import ErrorModal from "../components/ErrorModal";
import UserContacts from "../components/UserContact";

const CreateContact = ({ navigation }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const initialValues = { code: "+91", flag: "🇮🇳", name: "India" };
  const [countryCode, setCountryCode] = useState(initialValues);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [buttonScale] = useState(new Animated.Value(1)); // Animation for button press
  const [fadeAnim] = useState(new Animated.Value(0)); // Animation for error modal

  const handlePhoneChange = (text: string) => {
    const value = text.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(value);
  };

  const [addUserContact, { isLoading }] = useAddUserContactMutation();

  const handleAddContact = async () => {
    if (!isValidMobile(phoneNumber, countryCode?.code)) return;

    Vibration.vibrate(50); // Haptic feedback
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await addUserContact({
        phone: phoneNumber,
        countryCode: countryCode?.code,
      }).unwrap();
      setPhoneNumber("");
    } catch (err) {
      setError(err?.data?.message || err?.message || "Unable to add contact");
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const isValidPhoneNumber = isValidMobile(phoneNumber, countryCode?.code);

  return (
    <SafeAreaView style={styles.container}>
      <Header heading="New Contact" backHandler={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 10 }}>
        {/* Phone Input Section */}
        <View style={styles.phoneInputContainer}>
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
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.button, (!isValidPhoneNumber || isLoading) && styles.disabledButton]}
          disabled={!isValidPhoneNumber || isLoading}
          onPress={handleAddContact}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            {!isLoading ? (
              <Text style={styles.buttonText}>Add</Text>
            ) : (
              <ActivityIndicator color={COLORS.WHITE} />
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Country Picker Modal */}
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
      </View>

      {/* User Contacts Section */}
      <UserContacts
        search={phoneNumber}
        mobileContactHeading={"Invite Users"}
        savedContactHeading={"Saved Contacts"}
        searchType="number"
      />

      {/* Error Modal */}
      {error && (
        <ErrorModal
          message={error}
          isVisible={error?.length > 0}
          onClose={() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => setError(""));
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    width: "100%",
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK,
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: COLORS.TEXT_DARK,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: "90%",
    alignSelf: "center",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
});

export default CreateContact;