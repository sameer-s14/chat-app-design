import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import Avatar from "../components/Avatar";
import { ws } from "../utils";

const initialMessages = [
    { id: "1", type: "message", sender: "John", text: "Hello everyone!" },
    { id: "2", type: "message", sender: "Alice", text: "It's almost done! Just finalizing the UI.It's almost done! Just finalizing the UI.It's almost done! Just finalizing the UI.It's almost done! Just finalizing the UI." },
    { id: "3", type: "message", sender: "You", text: "How's the project going?" },
    { id: "4", type: "event", text: "Alice joined the group." },
    { id: "5", type: "event", text: "John left the group." },
];

const MessageItem = ({ item }) => {
    if (item.type === "event") {
        return <Text style={styles.eventText}>{item.text}</Text>;
    }

    return (
        <View style={[styles.messageRow, item.sender === "You" ? styles.rightMessageRow : styles.leftMessageRow]}>
            {item.sender !== "You" && <Avatar size={30} iconSize={30} />}
            <View style={item.sender === "You" ? styles.myMessage : styles.otherMessage}>
                <Text style={[styles.messageText, item.sender === "You" ? { color: COLORS.WHITE } : { color: COLORS.BLACK }]}>{item.text}</Text>
            </View>
        </View>
    );
};

export default function ChatScreen({ navigation }) {
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (message.trim().length > 0) {
            setMessages((prevMessages) => [
                { id: Date.now().toString(), type: "message", sender: "You", text: message },
                ...prevMessages,
            ]);
            setMessage("");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                </TouchableOpacity>
                <Avatar imageUrl={"https://i.pravatar.cc/150?img=1"} size={35} style={styles.profileImage} />
                <Text style={styles.headerText}>Group Chat</Text>
            </View>

            {/* MESSAGES LIST */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MessageItem item={item} />}
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
        padding: 15,
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
    }
});

