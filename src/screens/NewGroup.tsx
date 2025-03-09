import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { hs, ms, ws } from "../utils";
import SearchingHeader from "../components/SearchingHeader";
import { useGetUserContactsQuery } from "../api";

const NewGroup = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState({});

  const toggleSelection = (item) => {
    let copiedIds = { ...selectedContacts };
    if (copiedIds[item?.id]) {
      delete copiedIds[item?.id]
    } else {
      copiedIds = { ...copiedIds, [item?.id]: item };
    }
    setSelectedContacts(copiedIds);
  };

  const removeContact = (id) => {
    const copiedIds = { ...selectedContacts };
    if (copiedIds[id]) {
      delete copiedIds[id]
      setSelectedContacts(copiedIds)
    }
  };

  const { data } = useGetUserContactsQuery(undefined, {
    // skip: contacts.length > 0,
  });
  const savedContacts = data?.data || {};

  const filteredConversations = savedContacts?.contacts?.filter((contact) =>
    !searchTerm || contact?.name?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const renderItem = ({ item }) => {
    const isSelected = !!selectedContacts[item?.id];

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => toggleSelection(item)}>
        <View style={styles.avatarContainer}>
          {item?.profile ? <Image source={{ uri: item?.profile }} style={styles.avatar} /> : <View style={[styles.avatar, styles.defaultAvatar]}>
            <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
          </View>}
          {isSelected && (
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark-circle" size={20} color="green" />
            </View>
          )}
        </View>
        <View style={styles.chatDetails}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const isContactSelected = Object.keys(selectedContacts)?.length > 0;
  return (
    <SafeAreaView style={styles.container}>
      <SearchingHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} backHandler={() => navigation.goBack()} heading="New group" />

      {/* Selected Contacts Row */}
      {Object.keys(selectedContacts || {})?.length > 0 && (
        <View style={styles.selectedContainer}>
          <FlatList
            horizontal
            data={Object.values(selectedContacts || {})}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.selectedItem}
                onPress={() => removeContact(item.id)}
              >
                <View style={{ position: "relative", width: ms(55) }}>
                  {item?.profile ? <Image source={{ uri: item.profile }} style={styles.selectedAvatar} /> : <View style={[styles.avatar, styles.defaultAvatar, styles.selectedAvatar]}>
                    <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
                  </View>}
                  <View
                    style={styles.removeIcon}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.RED} />
                  </View>
                </View>
                <Text style={styles.selectedName} numberOfLines={1}>{item?.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Contact List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fabButton, !isContactSelected && { backgroundColor: COLORS.DARK_SLATE_GRAY, opacity: 0.7 }]}
        disabled={!isContactSelected}
        onPress={() => navigation.navigate("CreateGroup", { selectedContacts })}

      >
        <Ionicons name="arrow-forward" size={30} color={COLORS.WHITE} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  fabButton: {
    position: "absolute",
    bottom: hs(20),
    right: ws(20),
    width: ms(60),
    height: ms(60),
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 3,
  },
  defaultAvatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B0BEC5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: hs(40),
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  list: { paddingBottom: 20 },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: ms(45),
    height: ms(45),
    borderRadius: 25,
  },
  checkIcon: {
    position: "absolute",
    bottom: -5,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
  },
  chatDetails: { marginLeft: 10 },
  name: { fontWeight: "bold", fontSize: 16 },

  /* Selected Contacts Row */
  selectedContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  selectedItem: {
    marginRight: 20,
    marginVertical: 5,
  },
  selectedName: { width: ms(60), fontSize: 12, color: COLORS.GRAY },
  selectedAvatar: {
    width: ms(55),
    height: ms(55),
    borderRadius: 25,
  },
  removeIcon: {
    position: "absolute",
    bottom: -5,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

export default NewGroup;
