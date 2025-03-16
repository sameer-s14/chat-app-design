import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  LayoutAnimation,
  Keyboard,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS, MESSAGE_TYPES, SOCKET_EVENTS } from "../constants";
import { EmojiKeyboard } from 'rn-emoji-keyboard';
import * as ImagePicker from "expo-image-picker";
import CommonBottomSheet from "../components/CommonBottomSheet";
import * as DocumentPicker from "expo-document-picker";
import { useFinalizeUploadMutation, useGetChatDetailsQuery, useGetMessagesQuery, useUploadFileMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { IReaction, ISendMessage } from "../interface";
import MessageItem from "@/components/MessageItem";
import { getCopiedText, groupMessagesByDate, height, isLastInSequence, uriToBlob, ws } from "../utils";
import DateSeparator from "../components/DateSeperator";
import ProfilePic from "../components/ProfilePic";
import AnimatedHeader from "@/components/AnimatedHeader";
import * as Clipboard from "expo-clipboard";
import CustomToast from "../components/CustomToast";
import ReplyPreview from "../components/ReplyPreview";
import { SectionList } from "react-native";
import ReactionView from "@/components/ReactionView";

const mediaOptions = [
  { name: "Images", icon: "image", type: "image" },
  { name: "Videos", icon: "videocam", type: "video" },
  { name: "Audio", icon: "musical-notes", type: "audio" },
  { name: "Document", icon: "document", type: "document" },
  { name: "Gallery", icon: "images", type: "gallery" },
  { name: "Camera", icon: "camera", type: "camera" },
];

export default function MessagesList({ navigation, route }) {
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
  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [finalizeUpload] = useFinalizeUploadMutation();
  const [selectedMessages, setSelectedMessages] = useState({});
  const selectedMessageCount = Object.keys(selectedMessages)?.length;
  const [toastMessage, setToastMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const messageRefs = useRef({});
  const screenHeight = height;
  const [isReactionVisible, setIsReactionVisible] = useState(false);

  const handleReactions = (message) => {
    const ref = messageRefs.current[message._id];
    if (!ref) return;

    ref.measureInWindow((x, y, width, height) => {
      let modalHeight = 56;
      let newTop = y - modalHeight - 5; // Default above

      if (newTop < 60) {
        newTop = y + height + 5;
      }

      if (newTop + modalHeight > screenHeight) {
        newTop = screenHeight - modalHeight - 20; // Keep within bounds
      }

      setModalPosition({ top: newTop, left: x });
      setSelectedMessage(message);
      setIsReactionVisible(true);
    });
  };

  const closeReactionView = () => {
    setIsReactionVisible(false);
    setSelectedMessage(null);
  }

  const sectionListRef = useRef(null);

  const scrollToMessage = (messageId) => {
    let sectionIndex = -1;
    let itemIndex = -1;

    groupedMessages.some((section, sIndex) => {
      const index = section.data.findIndex((msg) => msg._id === messageId);
      if (index !== -1) {
        sectionIndex = sIndex;
        itemIndex = index;
        return true;
      }
      return false;
    });

    if (sectionIndex !== -1 && itemIndex !== -1) {
      sectionListRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex,
        animated: true,
        viewPosition: 0.5, // Adjusts where the message appears on the screen (center)
      });
    }
  };


  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleEmojiDelete = () => {
    setMessage((prev) => {
      const characters = Array.from(prev);
      characters.pop();
      return characters.join("");
    });
  };

  const toggleEmojiPicker = () => {
    if (showEmojiPicker) {
      // Hide emoji picker and focus input field
      setShowEmojiPicker(false);
      inputRef.current?.focus();
    } else {
      // Hide keyboard first, then show emoji picker
      Keyboard.dismiss();
      setTimeout(() => setShowEmojiPicker(true), 100);
    }
  };

  // Handle input focus (ensures emoji picker closes)
  const handleInputFocus = () => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    }
  };

  const sendMessage = (files?: any) => {
    if (previewMessage) {
      setPreviewMessage(null)
    }
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
    if (previewMessage?._id) {
      messageData.replyTo = previewMessage?._id
      setPreviewMessage(null)
    }
    if (socket?.connected && chatId && (message || files?.length)) {
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData)
    }
  };

  const sendReaction = (emoji) => {
    if (selectedMessage?._id) {
      const reactionData: IReaction = {
        chatId: chatId,
        messageId: selectedMessage?._id,
        senderId: user?.userId,
        emoji: emoji
      }
      if (socket?.connected && chatId) {
        socket.emit(SOCKET_EVENTS.REACTION, reactionData)
      }
      setSelectedMessage(null)
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
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [selectedMessages]);

  const OnMessageSelect = useCallback((message) => {

    setSelectedMessages((prev) => {
      const copied = { ...(prev || {}) }
      copied[message?._id] ? delete copied[message?._id] : copied[message?._id] = message;
      if (Object?.values(copied)?.length === 1) {
        handleReactions(message)
      }
      return copied;

    })
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* ANIMATED HEADER */}
      <AnimatedHeader
        selectedMessages={selectedMessages || {}}
        onBack={() => setSelectedMessages({})}
        onReply={() => {
          setPreviewMessage(Object.values(selectedMessages)[0] || null)
          setSelectedMessages({})
        }}
        onCopy={async () => {
          const sortedMessages = (Object.values(selectedMessages) || [])?.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt));
          const messages = getCopiedText(sortedMessages)
          if (messages) {
            await Clipboard.setStringAsync(messages);
            setSelectedMessages({})
            setToastMessage(`${selectedMessageCount} copied`)
          }
        }}
        onDelete={() => {
          const messageId = Object.keys(selectedMessages)[0];
          console.log('Delete message:', messageId);
          setSelectedMessages({});
        }}
        onForward={() => {
          const messageId = Object.keys(selectedMessages)[0];
          console.log('Forward message:', messageId);
        }}
      />

      {/* DEFAULT HEADER */}
      {!selectedMessageCount && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChatInfo', { chatId });
            }}
            style={styles.headingSection}
          >
            <ProfilePic name={chatDetails?.name} size={40} image={chatDetails?.image} />
            <Text style={styles.headerText}>{chatDetails?.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginStart: 'auto' }}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.BLACK} />
          </TouchableOpacity>
        </View>
      )}


      {/* MESSAGES LIST */}
      <SectionList
        ref={sectionListRef}
        sections={groupedMessages} // Make sure groupedMessages follows { title, data } structure
        keyExtractor={(item) => item._id}
        keyboardDismissMode="on-drag"
        renderSectionHeader={({ section: { title } }) => <DateSeparator date={title} />}
        renderItem={({ item: message, index, section }) => (
          <MessageItem
            messageRefs={messageRefs}
            selectedCount={selectedMessageCount}
            selected={!!selectedMessages[message._id]}
            key={message._id}
            item={message}
            onLongPress={() => { OnMessageSelect(message) }}
            onPress={() => {
              if (Object.keys(selectedMessages)?.length) {
                return OnMessageSelect(message)
              }
              if (message?.type === MESSAGE_TYPES.REPLY && message?.messageReply?._id) {
                return scrollToMessage(message?.messageReply?._id)
              }
              // return handleReactions(message)
            }}
            loggedUserId={user?.userId}
            isLastInSequence={isLastInSequence(section?.data, index)}
          />
        )}
        contentContainerStyle={styles.messageList}
        inverted
      />

      {/* EMOJI PICKER */}
      {previewMessage && <ReplyPreview
        replyPreview={previewMessage}
        onClose={() => setPreviewMessage(null)}
      />}
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
          onPress={toggleEmojiPicker}
        >
          {!showEmojiPicker ? <Ionicons name={"happy"} size={24} color={COLORS.GRAY} /> :
            <MaterialCommunityIcons name="keyboard-outline" size={24} color="black" />}
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={[styles.input]}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.TEXT_LIGHT}
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline={true}
          numberOfLines={6}
          scrollEnabled={true}
          onFocus={handleInputFocus}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={20} color={COLORS.WHITE} />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {showEmojiPicker && (
        <View style={[styles.emojiPicker, { position: 'relative' }]}>
          <Pressable
            style={{
              padding: 10,
              position: 'absolute',
              alignItems: "center",
              backgroundColor: "#f2f2f2",
              borderBottomWidth: 1,
              borderColor: "#ccc",
              zIndex: 1,
              borderStartStartRadius: 20,
              borderStartEndRadius: 20,
              paddingStart: 15,
              top: 0,
              right: 0
            }}
            onPress={handleEmojiDelete}
          >
            <Ionicons name="backspace-outline" size={24} color="black" />
          </Pressable>
          <EmojiKeyboard onEmojiSelected={handleEmojiSelect}
            allowMultipleSelections={true}
            categoryPosition={'top'}
            enableRecentlyUsed={true}
            styles={{ category: { container: { marginEnd: 50 } } }}
          />
        </View>
      )}

      {/* MEDIA BOTTOM SHEET */}
      {/* <CommonBottomSheet
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
      </CommonBottomSheet> */}
      <CustomToast visible={toastMessage?.length > 0} message={toastMessage} onHide={() => setToastMessage('')} />

      {!!selectedMessage && isReactionVisible && <ReactionView
        modalPosition={modalPosition}
        visible={!!selectedMessage}
        onSelect={sendReaction}
        closeReactionView={closeReactionView}
      />}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PALE_GRAY,
  },
  animatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderColor: COLORS.SOFT_GRAY,
    overflow: 'hidden',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 10,
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
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderColor: COLORS.SOFT_GRAY,
  },
  attachmentButton: {
    marginRight: 10,
    marginBottom: 8,
  },
  emojiButton: {
    marginRight: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    minHeight: 40, // Minimum height for 1 line
    maxHeight: 120, // Maximum height for 6 lines
    backgroundColor: COLORS.SOFT_GRAY,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: "bottom",
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