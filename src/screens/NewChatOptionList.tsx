import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { hs, ms, width, ws } from "../utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from '../components/Avatar';
import SearchingHeader from "../components/SearchingHeader";

const MOCK_CONVERSATIONS = [
  { id: "1", name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?img=1", lastMessage: "Hey!", lastMessageTime: "2:30 PM", unreadCount: 2 },
  { id: "2", name: "Bob Smith", avatar: "https://i.pravatar.cc/150?img=2", lastMessage: "Meeting at 4 PM", lastMessageTime: "1:45 PM", unreadCount: 1 },
  { id: "3", name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?img=3", lastMessage: "Sounds good!", lastMessageTime: "Yesterday", unreadCount: 0 },
];

const NewChatOptionList = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = MOCK_CONVERSATIONS.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.lastMessageTime}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchingHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} backHandler={() => navigation.goBack()} />

      {/* New Chat Options */}
      {!searchTerm && <><TouchableOpacity style={styles.chatItem} onPress={()=>{
        navigation.navigate("NewGroup")
      }}>
        <Avatar icon="person-add" iconSize={35} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>New group</Text>
          </View>
        </View>
      </TouchableOpacity>
        <TouchableOpacity style={[styles.chatItem, {
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }]}>
          <Avatar icon="people" iconSize={35}/>
          <View style={styles.chatDetails}>
            <View style={styles.chatHeader}>
              <Text style={styles.name}>New contact</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
      }
      <Text style={{ paddingLeft: 10, paddingVertical: 5 }}>Saved contacts</Text>
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomColor: COLORS.LIGHT_GRAY,
    height: hs(60),
  },
  list: { paddingBottom: 20 },
  chatItem: {
    flexDirection: "row",
    padding: 10,
  },
  avatar: {
    width: ms(45),
    height: ms(45),
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: { flex: 1, justifyContent: "center" },
  chatHeader: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "bold", fontSize: 16 },
  time: { fontSize: 12, color: "gray" },
  lastMessage: { fontSize: 14, color: "gray", marginTop: 4 },
});

export default NewChatOptionList;
