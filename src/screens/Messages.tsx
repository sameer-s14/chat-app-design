import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SOCKET_EVENTS } from "../constants";
import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import CommonBottomSheet from "../components/CommonBottomSheet";
import * as DocumentPicker from "expo-document-picker";
import { useFinalizeUploadMutation, useGetChatDetailsQuery, useGetMessagesQuery, useUploadFileMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { ISendMessage } from "../interface";
import MessageItem from "@/components/MessageItem";
import { isLastInSequence, uriToBlob } from "../utils";
import DateSeparator from "../components/DateSeperator";
import ProfilePic from "../components/ProfilePic";

const mediaOptions = [
  { name: "Images", icon: "image", type: "image" },
  { name: "Videos", icon: "videocam", type: "video" },
  { name: "Audio", icon: "musical-notes", type: "audio" },
  { name: "Document", icon: "document", type: "document" },
  { name: "Gallery", icon: "images", type: "gallery" },
  { name: "Camera", icon: "camera", type: "camera" },
];


const groupMessagesByDate = (messages) => {
  const groupedMessages = {};
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return Object.entries(groupedMessages).map(([date, messages]) => ({
    date,
    messages,
  }));
};



export default function ChatScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state?.auth);
  const chatId = route?.params?.chatId;
  const { data } = useGetChatDetailsQuery(chatId, { skip: !chatId });
  const chatDetails = data?.data;
  const { data: messagesData, refetch } = useGetMessagesQuery(chatId, { skip: !chatId });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);
  const { socket } = useSelector((state) => state?.socket);
  const groupedMessages = groupMessagesByDate(messages);
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [finalizeUpload] = useFinalizeUploadMutation();

  const sendMessage = (files?: any) => {
    const messageData: ISendMessage = {
      chatId: chatId,
      message: "",
      senderId: user?.userId,
      files: []
    }
    if (message.trim().length > 0) {
      messageData.message = message.trim()
      setMessage("");
    }
    if (files?.length) {
      messageData.files = files
    }
    if (socket?.connected && chatId && (message || files?.length)) {
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData)
    }
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (socket?.connected && chatId) {
      socket.emit(SOCKET_EVENTS.JOIN_CHAT, { userId: user?.userId, chatId: chatId });

      const handleNewMessage = (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
        dispatch(
          messagesApi?.util?.updateQueryData("getMessages", chatId, (draft) => {
            draft?.data?.push(data);
          }) as any
        );
      };

      socket?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage)
      return () => {
        socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    if (messagesData?.data) {
      setMessages([...messagesData.data].reverse());
    }
  }, [messagesData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();  // Manually refetch messages when the screen is focused
    });

    return unsubscribe;
  }, [navigation, refetch]);

  const uploadFilesParallel = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const blob = await uriToBlob(file.uri);
      if (blob) {
        const { url: fileUrl } = await uploadFile({
          blob,
          filename: file.name,
          filetype: file.type
        }).unwrap();
        return finalizeUpload({ fileId: fileUrl.split('/').pop() });
      }
    });

    return Promise.all(uploadPromises);
  };

  const openMediaPicker = async (type: 'image' | 'video' | 'document' | 'audio' | 'gallery' | 'camera') => {
    let result;
    if (type === 'image' || type === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled) {
        try {
          const newImages = result.assets.map(asset => ({
            uri: asset.uri,
            uploadPercentage: 0,
            type: 'files',
            content: asset?.fileName,
            sender: { _id: user?.userId },
          }));

          const uploadedResult = await uploadFilesParallel(result?.assets);
          if (uploadedResult?.length) {
            const files = uploadedResult?.map(({ data }) => data?.data)?.filter(Boolean);

            setMessages(prevMessages => [...newImages, ...prevMessages]);
            return sendMessage(files);
          }
        } catch (err) {
          console.log(">>>>>>>>>>>>>>>>>>", err)
        }

      }
    } else if (type === 'video') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
    } else if (type === 'audio') {
      result = await DocumentPicker.getDocumentAsync({
        type: [DocumentPicker.types.audio],
      });
    } else if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (type === 'document') {
      // Implement document picker logic here
    }
    // Handle the result as needed
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatInfo', { chatId })
          }}
          style={styles.headingSection}>

          <ProfilePic name={chatDetails?.name} size={40} image={chatDetails?.image} />
          <Text style={styles.headerText}>{chatDetails?.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginStart: 'auto' }}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.BLACK} />
        </TouchableOpacity>
        <Modal
          transparent
          animationType="fade"
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                setMenuVisible(false);
                navigation.navigate('ChatInfo', { chatId })
              }}>
                <Text style={styles.menuText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => alert("Clear Chat")}>
                <Text style={styles.menuText}>Clear Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => alert("Exit Chat")}>
                <Text style={styles.menuText}>Exit Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* MESSAGES LIST */}
      <FlatList
        data={groupedMessages}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View>
            <DateSeparator date={item.date} />
            {item?.messages.map((message, index) => (
              <MessageItem
                key={message._id}
                item={message}
                loggedUserId={user?.userId}
                isLastInSequence={isLastInSequence(item?.messages, index)}
              />
            ))}
          </View>
        )}
        contentContainerStyle={styles.messageList}
        inverted
      />

      {/* EMOJI PICKER */}
      {showEmojiPicker && (
        <View style={styles.emojiPicker}>
          <EmojiSelector
            onEmojiSelected={(emoji) => {
              setMessage((prev) => prev + emoji);
              setShowEmojiPicker(false);
            }}
          />
        </View>
      )}

      {/* SEND MESSAGE SECTION */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={() => bottomSheetRef.current?.expand()}
        >
          <Ionicons name="attach" size={24} color={COLORS.GRAY} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emojiButton}
          disabled={true}
          onPress={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Ionicons name="happy" size={24} color={COLORS.GRAY} />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={[styles.input, { fontSize: 16 }]}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.TEXT_LIGHT}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color={COLORS.WHITE} />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* MEDIA BOTTOM SHEET */}
      <CommonBottomSheet
        bottomSheetRef={bottomSheetRef}
        closeBottomSheet={() => bottomSheetRef.current.close()}
        snapPoints={["30%"]}
      >
        <View style={styles.tabContainer}>
          {mediaOptions.map((option) => (
            <TouchableOpacity
              key={option.name}
              style={styles.tab}
              onPress={() => {
                openMediaPicker(option.type);
                bottomSheetRef.current.close();
              }}
            >
              <Ionicons
                name={option.icon}
                size={30}
                color={COLORS.ACCENT}
              />
              <Text style={styles.tabText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </CommonBottomSheet>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PALE_GRAY,
  },
  headingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    padding: 15,
    paddingVertical: 5,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GRAY,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.TEXT_DARK, marginVertical: 10,
  },
  messageList: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderColor: COLORS.SOFT_GRAY,
  },
  attachmentButton: {
    marginRight: 10,
  },
  emojiButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.SOFT_GRAY,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: COLORS.ACCENT,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiPicker: {
    height: 250,
  },
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
  },
  tab: {
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: COLORS.SOFT_GRAY,
    borderRadius: 10,
    width: "30%",
  },
  tabText: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.TEXT_DARK,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  menuButton: {
    padding: 10,
    marginStart: 'auto'
  },
  modalOverlay: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    paddingRight: 5,
    paddingTop: 50,
  },
  menu: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 5,
    width: "60%",
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
});