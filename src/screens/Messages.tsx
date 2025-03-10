import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SOCKET_EVENTS } from "../constants";
import Avatar from "../components/Avatar";
import { getIconColor, ms, uriToBlob, ws } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { messagesApi, useFinalizeUploadMutation, useGetChatDetailsQuery, useGetMessagesQuery, useUploadFileMutation } from "../api";
import { ISendMessage } from "../interface";
import { Modal } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import CommonBottomSheet from "../components/CommonBottomSheet";
import * as DocumentPicker from "expo-document-picker";

const mediaOptions = [
    { name: 'Images', icon: 'image', type: 'image' },
    { name: 'Videos', icon: 'videocam', type: 'video' },
    { name: 'Audio', icon: 'musical-notes', type: 'audio' },
    { name: 'Document', icon: 'document', type: 'document' },
    { name: 'Gallery', icon: 'images', type: 'gallery' }, // Assuming gallery uses image picker
    { name: 'Camera', icon: 'camera', type: 'camera' },
];


const MessageItem = ({ item, loggedUserId }) => {
    if (item.type === "event") {
        return <Text style={styles.eventText}>{item?.message}</Text>;
    }

    const isSender = item?.sender?._id === loggedUserId;

    if (item?.type === "files") {
        return <View style={[styles.messageRow, isSender ? styles.rightMessageRow : styles.leftMessageRow]}>
            {!isSender && <Avatar imageUrl={item?.sender?.profile} size={30} iconSize={30} />}
            <View style={isSender ? styles.myMessage : styles.otherMessage}>
                {item?.uri && (
                    <Image source={{ uri: item.uri }} style={{ width: 100, height: 100 }} />
                )}
                <Text style={[styles.messageText, isSender ? { color: COLORS.WHITE } : { color: COLORS.BLACK }]}>
                    {item?.content}
                </Text>
                {isSender && item.uploadPercentage !== undefined && (
                    <Text style={styles.uploadPercentageText}>
                        {item.uploadPercentage}%
                    </Text>
                )}
            </View>
        </View>
    }
    return (
        <View style={[styles.messageRow, isSender ? styles.rightMessageRow : styles.leftMessageRow]}>
            {!isSender && <Avatar imageUrl={item?.sender?.profile} size={30} iconSize={30} />}
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
    const [menuVisible, setMenuVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [uploadFile, { isLoading }] = useUploadFileMutation();
    const [finalizeUpload] = useFinalizeUploadMutation();

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
            // console.log('>>>>>',chatId,messagesData?.data)
            setMessages([...messagesData.data].reverse());
        }
    }, [messagesData]);

    const bottomSheetRef = useRef(null);
    const startUpload = (newImages) => {
        newImages.forEach((image, index) => {
            const interval = setInterval(() => {
                setImages(prevImages => {
                    const updatedImages = [...prevImages];
                    const currentImage = updatedImages[updatedImages.length - newImages.length + index];
                    if (currentImage?.uploadPercentage < 100) {
                        currentImage.uploadPercentage += 10; // Increment upload percentage
                    } else {
                        clearInterval(interval); // Stop the interval when 100% is reached
                    }
                    return updatedImages;
                });
            }, 1000); // Update every second
        });
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

                    console.log('newImages', newImages);

                    setMessages(prevMessages => [...prevMessages, ...newImages]);
                    const file = newImages[0];
                    const blob = await uriToBlob(file?.uri);
                    if (blob) {
                        const { url: fileUrl } = await uploadFile({
                            blob,
                            filename: file.name,
                            filetype: file.type
                        }).unwrap();
                        const fileId = (fileUrl || '')?.split('/')?.pop()
                        if (fileId) {
                            const newData = await finalizeUpload({ fileId });
                            console.log('newDatanewData', newData)
                        }
                    }

                    // startUpload(newImages);
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


    // const uploadFile = (blob, filename, filetype) => {
    //     console.log("🚀 Uploading file:", filename, blob);
    //     setUploading(true);

    //     const upload = new tus.Upload(blob, {
    //         endpoint: `${BASE_URL}/files/`,
    //         retryDelays: [0, 3000, 5000, 10000],
    //         metadata: {
    //             filename: filename,
    //             filetype: filetype,
    //         },
    //         onError: (error) => {
    //             console.error("❌ Upload failed:", error);
    //             setUploading(false);
    //             Alert.alert("Upload Failed", error.message || "Something went wrong.");
    //         },
    //         onProgress: (bytesUploaded, bytesTotal) => {
    //             const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    //             setUploadPercentage(percentage);
    //         },
    //         onSuccess: () => {
    //             console.log("✅ Upload completed:", upload.url);
    //             setUploading(false);
    //             setUploadPercentage(100);
    //         },
    //     });

    //     upload.start();
    // };

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
            <View style={[styles.inputContainer, { borderRadius: 25, backgroundColor: '#fff', elevation: 2 }]}>
                <TouchableOpacity style={styles.attachmentButton} onPress={() => bottomSheetRef.current?.expand()}>
                    <Ionicons name="attach" size={24} color={COLORS.GRAY} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons name="send" size={17} color="white" />
                </TouchableOpacity>
            </View>
            <CommonBottomSheet
                bottomSheetRef={bottomSheetRef}
                closeBottomSheet={() => bottomSheetRef.current.close()}
                snapPoints={['30%']}
                handleSheetChanges={(index) => console.log('Sheet index changed to:', index)}
            >
                <View style={styles.tabContainer}>
                    {mediaOptions.map((option) => (
                        <TouchableOpacity
                            key={option.name}
                            style={styles.tab}
                            onPress={() => { openMediaPicker(option.type); bottomSheetRef.current.close(); }}
                        >
                            <Ionicons name={option.icon} size={30} color={getIconColor(option?.type)} />
                            <Text>{option.name}</Text>
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
        backgroundColor: COLORS.PALE_GRAY
    },
    tabContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Allows wrapping to the next line
        justifyContent: 'space-around',
        padding: 20,
    },
    tab: {
        alignItems: 'center',
        padding: 10,
        margin: 5, // Add margin to separate tabs
        borderWidth: 1,
        borderColor: '#ddd', // Optional: Add a border for separation
        width: ws(100),
        height: ws(80),
        borderRadius: 10,
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
    uploadPercentageText: {
        position: 'absolute',
        right: 10,
        top: 5,
        color: 'white', // Change to your desired color
        fontWeight: 'bold',
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

    inputContainer: {
        flexDirection: "row", alignItems: "center", padding: 10,
        elevation: 2,
    },
    attachmentButton: {
        marginHorizontal: 10
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
    },

    sendButton: {
        marginLeft: 10,
        backgroundColor: '#3b5998',
        borderRadius: 20,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: ms(35),
        width: ms(35)
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

