import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useGetAllChatsQuery } from "../api";
import ConfirmationModal from "@/components/ConfirmationModal";
import { HEADER_HEIGHT } from "../utils";
import { Conversation } from "../interface";
import ProfilePic from "../components/ProfilePic";
import { COLORS } from "../constants";
import { setChats } from "../redux/socketSlice";
import ProfileModal from "../components/ProfileModal";

const MENU_OPTIONS = [
  { label: "New Group", icon: "people-outline" },
  { label: "Archived", icon: "archive-outline" },
  { label: "Settings", icon: "settings-outline" },
  { label: "Logout", icon: "log-out-outline" },
];

const ChatScreen = ({ navigation }) => {
  const { data, isLoading, isError, refetch, isFetching } = useGetAllChatsQuery(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [chatInfo, setChatInfo] = useState({});
  const dispatch = useDispatch();
  const searchBarHeight = useRef(new Animated.Value(0)).current;
  const searchBarOpacity = useRef(new Animated.Value(0)).current;
  const { chats, typingUsers } = useSelector((state) => state?.socket) || {};

  function onImagePress(image) {
    navigation.navigate('ImageFullScreen', { image })
    setChatInfo({})
  }
  useEffect(() => {
    if (data?.data?.chatsFound) {
      dispatch(setChats(data?.data?.chatsFound || []))
    }
  }, [dispatch, data])
  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const toggleMenu = () => {
    setMenuVisible(() => !menuVisible);
  };

  const handleConfirm = () => {
    dispatch(logout());
    navigation.navigate("Login");
    setModalVisible(false);
  };

  // Toggle search bar visibility with animation
  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);
  };

  // Animate search bar when `isSearchVisible` changes
  useEffect(() => {
    if (isSearchVisible) {
      // Show search bar
      Animated.parallel([
        Animated.timing(searchBarHeight, {
          toValue: 60, // Set height to 60
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchBarOpacity, {
          toValue: 1, // Set opacity to 1
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Hide search bar
      Animated.parallel([
        Animated.timing(searchBarHeight, {
          toValue: 0, // Set height to 0
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchBarOpacity, {
          toValue: 0, // Set opacity to 0
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isSearchVisible]);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const query = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(query) ||
      chat.latestMessage?.message?.toLowerCase().includes(query)
    );
  });

  const renderChatItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        if (isSearchVisible) {
          setIsSearchVisible(false);
        }
        navigation.navigate("MessagesList", { chatId: item._id })
      }}
    >
      <ProfilePic name={item?.name} image={item?.image} isOnline={!!item?.isOnline} onPress={() => setChatInfo(item)} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          {item.latestMessage?.createdAt && (
            <Text style={styles.chatTime}>
              {new Date(item.latestMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
        <View style={styles.messageContainer}>
          {typingUsers[item?._id] ? <Text style={[styles.chatMessage, { color: COLORS.SUCCESS, fontWeight: 'bold' }]} numberOfLines={1}>
            {item?.isGroup ? `${typingUsers[item?._id]?.name} is typing...` : `typing...`}
          </Text> :
            <Text style={styles.chatMessage} numberOfLines={1}>
              {item.latestMessage?.message || "No messages yet"}
            </Text>
          }
          {item.unreadCount > 0 && (
            <View style={styles.unreadContainer}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={40} color="#FF3B30" />
        <Text style={styles.errorText}>Failed to load chats</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleSearchBar}>
              <Ionicons name="search-outline" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
              <Ionicons name="ellipsis-vertical" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditionally Render Animated Search Bar */}
        {isSearchVisible && (
          <Animated.View
            style={[
              styles.searchContainer,
              {
                height: searchBarHeight,
                opacity: searchBarOpacity,
              },
            ]}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {isLoading && <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0084FF" />
        </View>}
        {/* Chat List */}
        {!isLoading && <>
          <FlatList
            refreshing={isFetching}
            onRefresh={refetch}
            data={filteredChats}
            keyExtractor={(item) => item._id}
            renderItem={renderChatItem}
            contentContainerStyle={styles.listContent}
            onScroll={() => {
              if (isSearchVisible && !searchQuery) {
                setIsSearchVisible(false);
              }
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No conversations found</Text>
              </View>
            }
          />

          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("NewChat")}
          >
            <Ionicons name="create-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </>}

        {/* Menu */}
        {menuVisible && (
          <>
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
              <View style={styles.menuBackdrop} />
            </TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {MENU_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    toggleMenu();
                    if (option.label === "Logout") {
                      handleShowModal();
                    } else if (option.label === "Settings") {
                      navigation.navigate("Profile");
                    }
                    else if (option.label === "New Group") {
                      navigation.navigate('NewGroup')
                    }
                  }}
                >
                  <Ionicons name={option.icon} size={20} color="#666" />
                  <Text style={styles.menuText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          confirmText="Logout"
          headingText="Are you sure?"
          subHeading="You are about to log out of your account."
        />

        {/* Profile info modal  */}
        {chatInfo?._id && <ProfileModal chatInfo={chatInfo} onClose={() => {
          setChatInfo({})
        }}
          onImagePress={() => onImagePress(chatInfo?.image)}
          onMessagePress={() => {
            navigation.navigate("MessagesList", { chatId: chatInfo._id });
            setChatInfo({})
          }}
          onInfoPress={() => {
            navigation.navigate('ChatInfo', { chatId: chatInfo._id });
            setChatInfo({});
          }}
        />}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 20,
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  clearButton: {
    padding: 4,
  },
  menuContainer: {
    position: "absolute",
    right: 16,
    top: HEADER_HEIGHT + 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20,
  },
  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 180,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1A1A1A",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chatContent: {
    flex: 1,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 8,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  chatTime: {
    fontSize: 12,
    color: "#666",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  unreadContainer: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0084FF",
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ChatScreen;