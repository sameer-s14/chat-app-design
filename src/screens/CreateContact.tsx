import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { Image, SectionList, StyleSheet, Text } from "react-native";
import { COLORS } from "../constants";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { CountryPicker } from "react-native-country-codes-picker";
import CountryCodeHeader from "../components/CountryCodeHeader";
import * as Contacts from "expo-contacts";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAddUserContactMutation, useGetUserContactsQuery } from "../api";
import { isValidMobile } from "../utils";

const CreateContact = ({ navigation }) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const initialValues = { code: "+91", flag: "🇮🇳", name: "India" };
  const [countryCode, setCountryCode] = useState(initialValues);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneChange = (text) => {
    const value = text.replace(/\D/g, ""); // Remove non-numeric characters
    setPhoneNumber(value);
  };
  const [contacts, setContacts] = useState([]);
  const { data, refetch } = useGetUserContactsQuery(undefined, {
    skip: contacts.length > 0,
  });
  const [addUserContact, { isError }] = useAddUserContactMutation();
  console.log(">>>>>>>>>>",isError)
  const savedContacts = data?.data || {};
  useEffect(() => {
    if (savedContacts?.contacts) {
      setContacts(savedContacts.contacts);
    }
  }, [savedContacts]);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      fetchContacts();
    } else {
      console.warn("Contacts permission denied");
    }
  };

  const fetchContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts: ", error);
    }
  };
  const filteredConversations = savedContacts?.contacts?.filter((conv) =>
    contact.phoneNumbers?.[0]?.number?.includes(phoneNumber)
  );

  const filteredContacts = contacts?.filter((contact) =>
    contact.phoneNumbers?.[0]?.number?.includes(phoneNumber) &&
    !savedContacts?.contacts?.some(saved => saved.phoneNumber === contact.phoneNumbers?.[0]?.number)
  );

  const sections = [
    {
      title: "Saved contacts",
      data: filteredConversations || [],
      renderItem: ({ item }) => (
        <TouchableOpacity style={styles.chatItem}>
          {item?.profile ? <Image source={{ uri: item.profile }} style={styles.avatar} /> : <View style={[styles.avatar, styles.defaultAvatar]}>
            <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
          </View>}
          <View style={styles.chatDetails}>
            <View style={styles.chatHeader}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          </View>
        </TouchableOpacity>
      ),
    },
    {
      title: "Invite users",
      data: filteredContacts || [],
      renderItem: ({ item }) => (
        <TouchableOpacity style={styles.chatItem}>
          <View style={[styles.avatar, styles.defaultAvatar]}>
            <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
          </View>
          <View style={styles.chatDetails}>
            <View style={styles.chatHeader}>
              <Text style={styles.name}>{item.name}</Text>
              <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ fontSize: 12, color: COLORS.PRIMARY }}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ),
    },
  ];

  function handleAddContact() {
    addUserContact({
      phone: phoneNumber,
      countryCode: countryCode?.code
    })
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
          !isValidPhoneNumber && { opacity: 0.5 },
          ]}
          onPress={handleAddContact}
        >
          <Text style={styles.buttonText}>Add</Text>
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


      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ section, item }) => section.renderItem({ item })}
        renderSectionHeader={({ section }) => section?.data?.length > 0 ? <Text style={styles.sectionHeader}>{section.title}</Text> : null}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
