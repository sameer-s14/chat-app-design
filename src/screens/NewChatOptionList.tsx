import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import SearchingHeader from "../components/SearchingHeader";
import UserContacts from "../components/UserContact";
import { useCreateOneToOneChatMutation } from "../api";


const NewChatOptionList = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [createOneToOneChat] = useCreateOneToOneChatMutation();

  async function savedContactHandler(userId) {
    try {
      const { data } = await createOneToOneChat(userId).unwrap();
      console.log(data)
      navigation.navigate("MessagesList", { chatId: data?.chatId, })
    } catch (err) {
    }
  }
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

      <UserContacts search={searchTerm} mobileContactHeading={"Invite Users"} savedContactHeading={"Saved Contacts"} savedContactHandler={savedContactHandler} />
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
