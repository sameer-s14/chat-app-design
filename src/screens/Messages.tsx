import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SOCKET_EVENTS } from "../constants";
import Avatar from "../components/Avatar";
import { ms, ws } from "../utils";
import { useSelector } from "react-redux";
import { useGetChatDetailsQuery, useGetMessagesQuery } from "../api";
import { ISendMessage } from "../interface";
import { Modal } from "react-native";

const initialMessages = [
    { id: "1", type: "message", sender: "John", text: "Hello everyone!" },
    { id: "2", type: "message", sender: "Alice", text: "It's almost done! Just finalizing the UI.It's almost done! Just finalizing the UI.It's almost done! Just finalizing the UI.It's almost done! Just finalizing the UI." },
    { id: "3", type: "message", sender: "You", text: "How's the project going?" },
    { id: "4", type: "event", text: "Alice joined the group." },
    { id: "5", type: "event", text: "John left the group." },
];

const MessageItem = ({ item, loggedUserId }) => {
    if (item.type === "event") {
        return <Text style={styles.eventText}>{item.text}</Text>;
    }

    const isSender = item?.sender?._id === loggedUserId;
    return (
        <View style={[styles.messageRow, isSender ? styles.rightMessageRow : styles.leftMessageRow]}>
            {!isSender && <Avatar size={30} iconSize={30} />}
            <View style={isSender ? styles.myMessage : styles.otherMessage}>
                <Text style={[styles.messageText, isSender ? { color: COLORS.WHITE } : { color: COLORS.BLACK }]}>{item?.message}</Text>
            </View>
        </View>
    );
};

export default function ChatScreen({ navigation, route }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const { socket } = useSelector((state) => state?.socket);
    const { user } = useSelector((state) => state?.auth);
    const chatId = route?.params?.chatId;
    const { data, error } = useGetChatDetailsQuery(chatId, { skip: !chatId });
    const chatDetails = data?.data;
    const { data: messagesData } = useGetMessagesQuery(chatId, { skip: !chatId });
    const messageList = messagesData?.data || [];
    const [menuVisible, setMenuVisible] = useState(false)

    const sendMessage = () => {
        if (message.trim().length > 0) {
            if (socket?.connected && chatId) {
                const messageDataToEmit: ISendMessage = {
                    chatId: chatId,
                    message: message.trim(),
                    senderId: user?.userId
                }
                socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageDataToEmit)
            }
            setMessage("");
        }
    };

    useEffect(() => {
        if (socket?.connected && chatId) {
            socket.emit(SOCKET_EVENTS.JOIN_CHAT, { userId: user?.userId, chatId: chatId });

            const handleNewMessage = (data) => {
                setMessages((prevMessages) => [data, ...prevMessages]);
            };

            socket?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage)
            return () => {
                socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
            };
        }
    }, [socket, chatId]);

    useEffect(() => {
        if (messagesData?.data) {
            setMessages(messagesData.data);
        }
    }, [messagesData]);

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => navigation.navigate('ChatInfo', { chatId })}>
                    {
                        chatDetails?.image ? <Image source={{ uri: chatDetails?.image }} style={styles.avatar} /> :
                            <View style={[styles.avatar, styles.defaultAvatar]}>
                                <FontAwesome6 name="user-large" size={15} color={COLORS.WHITE} />
                            </View>
                    }
                    <Text style={styles.headerText}>{chatDetails?.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
                    <Ionicons name="ellipsis-vertical" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>

                {/* Modal for Options */}
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
                            <TouchableOpacity style={styles.menuItem} onPress={() => alert("View Profile")}>
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
                data={messages || []}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={({ item }) => <MessageItem item={item} loggedUserId={user?.userId} />}
                contentContainerStyle={styles.messageList}
                inverted
            />

            {/* SEND MESSAGE SECTION */}
            <View style={[styles.inputContainer, { borderRadius: 50 }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.PALE_GRAY
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 5,
        // backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    profileImage: { marginHorizontal: 10 },
    headerText: { fontSize: 16, fontWeight: "bold" },

    messageList: {
        paddingHorizontal: 15,
        flexGrow: 1,
        backgroundColor: COLORS.PALE_GRAY
    },
    avatar: {
        width: ms(35),
        height: ms(35),
        borderRadius: 25,
        marginRight: 10,
    },
    defaultAvatar: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#B0BEC5",
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 5
    },

    rightMessageRow: {
        alignSelf: "flex-end",
        flexDirection: "row-reverse"
    },

    leftMessageRow: {
        alignSelf: "flex-start"
    },

    myMessage: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 15,
        maxWidth: "75%",
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        position: "relative",
    },

    otherMessage: {
        backgroundColor: COLORS.WHITE,
        padding: 10,
        borderRadius: 15,
        maxWidth: "75%",
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        position: "relative",
    },

    messageText: {
        fontSize: 14
    },

    eventText: {
        textAlign: "center",
        color: "gray",
        fontSize: 12,
        marginVertical: 5
    },

    inputContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
    input: {
        flex: 1, padding: 10, backgroundColor: COLORS.WHITE, borderRadius: 20, marginRight: 10, height: ws(45), paddingLeft: 15, shadowColor: COLORS.BLACK,
        shadowOffset: { width: 1, height: 5 },
        shadowOpacity: 1,
    },

    sendButton: {
        backgroundColor: COLORS.PRIMARY,
        padding: 10,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
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

