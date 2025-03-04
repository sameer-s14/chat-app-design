import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ActivityIndicator, Image, SectionList, StyleSheet, Text } from "react-native";
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
  const handlePhoneChange = (text: string) => {
    const value = text.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(value);
  };
  const [addUserContact, { isLoading }] = useAddUserContactMutation();

  async function handleAddContact() {
    try {
      await addUserContact({
        phone: phoneNumber,
        countryCode: countryCode?.code
      }).unwrap();
      setPhoneNumber('')
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Unable to add contact')
    }

  }

  const isValidPhoneNumber = isValidMobile(phoneNumber, countryCode?.code);
  return (
    <SafeAreaView style={styles.container}>
      <Header heading="New Contact" backHandler={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.phoneInputContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.countryCode}>{countryCode?.code}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.phoneInput}
            placeholder={t("ENTER_PHONE")}
            keyboardType="numeric"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
          />
        </View>
        <TouchableOpacity
          style={[styles.button,
          (!isValidPhoneNumber || isLoading) && { opacity: 0.5 },
          ]}
          disabled={!isValidPhoneNumber || isLoading}
          onPress={handleAddContact}
        >
          {!isLoading ? <Text style={styles.buttonText}>Add</Text> :
            <ActivityIndicator color={COLORS.WHITE} />}
        </TouchableOpacity>

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


      <UserContacts search={phoneNumber} mobileContactHeading={"Invite Users"} savedContactHeading={"Saved Contacts"} searchType="number" />
      {error && <ErrorModal message={error} isVisible={error?.length > 0} onClose={() => setError('')} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    width: "100%",
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: COLORS.LIGHT_GRAY
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  list: { paddingBottom: 20 },
  chatItem: {
    flexDirection: "row",
    padding: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  defaultAvatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B0BEC5",
  },
  chatDetails: { flex: 1, justifyContent: "center" },
  chatHeader: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "bold", fontSize: 16 },
  time: { fontSize: 12, color: "gray" },
  lastMessage: { fontSize: 14, color: "gray", marginTop: 4 },
  sectionHeader: {
    paddingLeft: 10,
    paddingVertical: 5,
    fontWeight: 400
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: "90%",
    alignSelf: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default CreateContact;
