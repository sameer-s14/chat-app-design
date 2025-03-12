import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { hs, ms, ws } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useGetAllChatsQuery } from "../api";
import Loader from "../components/Loader";

// Type definitionsup
interface Conversation {
  _id: string;
  name: string;
  image: string;
  latestMessage: any;
  unreadCount: number;
}

const MENU_OPTIONS = [
  {
    label: "Profile",
    icon: "person-outline",
  },
  {
    label: "Settings",
    icon: "settings-outline",
  },
  {
    label: "Logout",
    icon: "log-out-outline",
  },
];

const Home: React.FC = ({ navigation }) => {
  const { data, isLoading, isError, error } = useGetAllChatsQuery(undefined);
  const chatData = data?.data || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-280))[0];
  const [modalVisible, setModalVisible] = useState(false);

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    dispatch(logout());
    navigation.navigate("SplashScreen");
    setModalVisible(false);
  };

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -280 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };

  // const handleNewChat = () => {
  //   setFabModalVisible(true);
  // };
  const handleNewChat = () => {
    navigation.navigate("SelectUser");
  };

  const filteredConversations = (chatData?.chatsFound || [])?.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }: { item: Conversation }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate("MessagesList", { chatId: item?._id, name: item?.name, image: item?.image })}
      >
        {
          item?.image ? <Image source={{ uri: item?.image }} style={styles.avatar} /> :
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
            </View>
        }

        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{item.name}</Text>
            {item?.latestMessage?.createdAt && <Text style={styles.time}>{new Date(item?.latestMessage?.createdAt).toLocaleTimeString('en', { timeStyle: "short" })}</Text>}
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item?.latestMessage?.message || item?.latestMessage?.type || ''}
            </Text>
            {item?.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item?.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSideBarClick = (item) => {
    if (item.label === "Logout") {
      toggleMenu();
      handleShowModal();
    }
    if (item.label === "Profile") {
      toggleMenu();
      navigation.navigate('Profile');
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoading && <Loader />}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.header}>
        <View style={styles.subContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={30} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search chats"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredConversations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fabButton}
        // onPress={handleNewChat}
        onPress={handleNewChat}
      >
        <Ionicons name="add" size={30} color={COLORS.WHITE} />
      </TouchableOpacity>

      <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
        <View style={styles.sideMenuHeader}>
          {user?.profile ? (
            <Image
              source={{ uri: user?.profile }}
              style={styles.sideMenuAvatar}
            />
          ) : (
            <View style={styles.sideMenuAvatar}></View>
          )}
          <View style={styles.sideMenuUserInfo}>
            <Text style={styles.sideMenuUserName}>{user?.name}</Text>
            <Text style={styles.sideMenuUserPhone}>{user?.phone}</Text>
          </View>
        </View>

        {MENU_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleSideBarClick(option)}
          >
            <Ionicons name={option.icon as any} size={20} color="gray" />
            <Text style={styles.menuText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ConfirmationModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        confirmText="Logout"
        headingText="Are you sure?"
        subHeading="You are about to log out of your account."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    backgroundColor: COLORS.PRIMARY,
    borderBottomColor: "#ddd",
    height: hs(90),
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    color: COLORS.WHITE,
  },
  searchBar: {
    height: 40,
    backgroundColor: "#f1f1f1",
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  list: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: 25,
    marginRight: 10,
  },
  defaultAvatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B0BEC5",
  },
  chatDetails: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "blue",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -280,
    width: 280,
    backgroundColor: COLORS.WHITE,
    zIndex: 2,
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sideMenuHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: COLORS.PRIMARY,
    paddingBottom: 20,
  },
  sideMenuAvatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: 50,
    marginBottom: 10,
  },
  sideMenuUserInfo: {
    marginVertical: 5,
  },
  sideMenuUserName: {
    color: COLORS.WHITE,
    fontWeight: "500",
  },
  sideMenuUserPhone: {
    marginTop: 5,
    color: COLORS.WHITE,
    fontWeight: "400",
    fontSize: 12,
  },
  menuItem: {
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  // Floating Action Button Styles
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
});

export default Home;
