import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import SearchingHeader from "../components/SearchingHeader";
import * as Contacts from "expo-contacts";
import {  useGetUserContactsQuery } from "../api";


const NewChatOptionList = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState([]);
  const { data, refetch } = useGetUserContactsQuery(undefined, {
    skip: contacts.length > 0,
  });

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
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts?.filter((contact) =>
    contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
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

  return (
    <SafeAreaView style={styles.container}>
      <SearchingHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} backHandler={() => navigation.goBack()} />

      {/* New Chat Options */}
      {!searchTerm && (
        <>
          <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate("NewGroup")}>
            <Avatar icon="person-add" iconSize={35} />
            <View style={styles.chatDetails}>
              <Text style={styles.name}>New group</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chatItem, styles.borderBottom]}
            onPress={() => navigation.navigate("CreateContact")}
          >
            <Avatar icon="people" iconSize={35} />
            <View style={styles.chatDetails}>
              <Text style={styles.name}>New contact</Text>
            </View>
          </TouchableOpacity>
        </>
      )}

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
});

export default NewChatOptionList;
