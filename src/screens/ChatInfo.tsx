import React, { useRef, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, MaterialCommunityIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddAdminMutation, useCreateOneToOneChatMutation, useGetChatDetailsQuery, useRemoveAdminMutation, useRemoveMembersMutation } from "../api";
import { COLORS } from "../constants";
import TabItem from "../components/TabItem";
import { ms, width } from "../utils";
import { TextInput } from "react-native";
import { Modal } from "react-native";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useSelector } from "react-redux";

const groupData = {
    name: "MERN Stack Devs",
    image: null, // Use null for default icon
    members: [
        { id: "1", name: "Sameer" },
        { id: "2", name: "John Doe" },
        { id: "3", name: "Ayesha Khan" },
        { id: "4", name: "Rahul Sharma" },
        { id: "5", name: "David Smith" },
        { id: "6", name: "Sophia Wilson" },
        { id: "7", name: "Ali Khan" },
        { id: "8", name: "Priya Patel" },
        { id: "9", name: "Liam Brown" },
        { id: "10", name: "Olivia Taylor" },
        { id: "11", name: "Emma Johnson" }, // Extra members for "View All"
    ],
    media: [
        { id: "1", type: "photo", count: 25 },
        { id: "2", type: "video", count: 10 },
        { id: "3", type: "docs", count: 5 },
    ],
};
const IMAGE_SIZE = 90;

const GROUP_MODAL_TYPES = {
    REMOVE: 'remove'
}
export default function ChatInfo({ navigation, route }) {
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState('');
    const [createOneToOneChat] = useCreateOneToOneChatMutation();
    const [addAdmin] = useAddAdminMutation();
    const [removeAdmin] = useRemoveAdminMutation();
    const currentUser = useSelector((state) => state?.auth?.user);
    const [removeMembers] = useRemoveMembersMutation();

    const handleLongPress = (item) => {
        setSelectedUser(item);
        setModalVisible(true);
    };

    function toggleSearch() {
        setIsSearching((pre) => !pre)
    }
    const handleOptionPress = (option) => {
        Alert.alert(option, `You selected: ${option}`);
    };
    const { chatId } = route?.params

    const { data, error } = useGetChatDetailsQuery(chatId);
    const chatDetails = data?.data || {};

    const usersList = chatDetails?.users?.filter((user) =>
        !searchTerm || user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleRemove() {
        try {
            const data = await removeMembers({ chatId: chatDetails?._id, body: { participants: [selectedUser?.id] } });
            console.log(data);
        } catch (err) {
            console.log('ERROR IN REMOVEiNG USER', err)
        }
        setConfirmationModal('');
    }

    async function handleMessage() {
        try {
            const { data } = await createOneToOneChat(selectedUser?.id).unwrap();
            navigation.navigate("MessagesList", { chatId: data?.chatId, })
        } catch (err) {
            console.log('ERROR IN Messafe', err)
        }
        setModalVisible(false)
    }

    async function handleViewProfile() {
        try {
            const { data } = await createOneToOneChat(selectedUser?.id).unwrap();
            navigation.navigate("ChatInfo", { chatId: data?.chatId, })
        } catch (err) {
            console.log('ERROR IN Messafe', err)
        }
        setModalVisible(false)
    }

    async function handleMakeAdmin() {
        try {
            await addAdmin({ chatId, body: { users: [selectedUser?.id] } })
        } catch (err) {
            console.log(`Error in making admin`, err)
        }
        setModalVisible(false)
    }

    async function handleRemoveAdmin() {
        try {
            await removeAdmin({ chatId, body: { users: [selectedUser?.id] } })
        } catch (err) {
            console.log(`Error in making admin`, err)
        }
        setModalVisible(false)
    }

    const isGroupAdmin = chatDetails?.groupAdmins?.includes(currentUser?.userId);

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            {isSearching ? <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    toggleSearch()
                    setSearchTerm("")
                }}>
                    <Ionicons name="arrow-back" size={25} color={COLORS.BLACK} />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchTerm}
                    // ref={searchInputRef}
                    onChangeText={setSearchTerm}
                // autoFocus={isSearching}
                />
            </View> : <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOptionPress("Options")}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>}

            <View style={{ flex: 1 }}>
                <FlatList
                    showsVerticalScrollIndicator={false} 
                    ListHeaderComponent={() => {
                        return !isSearching && <>
                            {/* GROUP IMAGE & NAME */}
                            <View style={styles.groupInfo}>
                                {chatDetails?.image ? (
                                    <Image source={{ uri: chatDetails?.image }} style={styles.groupImage} />
                                ) : (
                                    <View style={styles.defaultAvatar}>
                                        <FontAwesome name="users" size={50} color="white" />
                                    </View>
                                )}
                                <Text style={styles.groupName}>{chatDetails?.name}</Text>
                                {chatDetails?.isGroup && <Text style={styles.memberCount}>{chatDetails?.users?.length} members</Text>}
                            </View>

                            <View style={styles.rowContainer}>
                                <TabItem
                                    boxSize={70}
                                    Icon={<MaterialCommunityIcons name="phone-outline" size={24} color={COLORS.PRIMARY} />}
                                    heading="Audio"
                                    onPress={() => console.log("Home Pressed")}
                                />
                                <TabItem
                                    boxSize={70}
                                    Icon={<MaterialCommunityIcons name="video-outline" size={24} color={COLORS.PRIMARY} />}
                                    heading="Video"
                                    onPress={() => console.log("Home Pressed")}
                                />
                                {chatDetails?.isGroup &&
                                    <TabItem
                                        boxSize={70}
                                        Icon={<Feather name="user-plus" size={24} color={COLORS.PRIMARY} />}
                                        heading="Add"
                                        onPress={() => navigation.navigate('AddMembers', { chatId, userIds: chatDetails?.users?.map((data) => data?.id) })}
                                    />}
                                <TabItem
                                    boxSize={70}
                                    Icon={<Ionicons name="search" size={20} color={COLORS.PRIMARY} />}
                                    heading="Search"
                                    onPress={() => console.log("Home Pressed")}
                                />
                            </View>

                            {/* MEDIA, LINKS & DOCS */}
                            <Text style={styles.sectionTitle}>Media, Links & Docs</Text>
                            <View horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
                                {groupData.media.map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.mediaItem}>
                                        <FontAwesome name={item.type === "photo" ? "image" : item.type === "video" ? "video-camera" : "file-text"} size={30} color="black" />
                                        <Text style={styles.mediaText}>{item.count}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* MEMBERS LIST */}
                            {chatDetails?.isGroup && <View style={styles.membersHeader}>
                                <Text style={styles.sectionTitle}>{chatDetails?.users?.length} Members</Text>
                                <TouchableOpacity onPress={toggleSearch} style={styles.searchIcon}>
                                    <Ionicons name="search" size={16} color="black" />
                                </TouchableOpacity>
                            </View>}
                        </>
                    }}
                    style={{ flex: 1 }}
                    data={chatDetails?.isGroup ? (showAllMembers ? usersList : usersList?.slice(0, 10)) : []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isUserAdmin = chatDetails?.groupAdmins?.includes(item?.id);
                        return <TouchableOpacity
                            disabled={currentUser?.userId === item?.id}
                            style={{
                                flexDirection: "row",
                                paddingVertical: 15,
                            }}
                            onLongPress={() => handleLongPress(item)}
                            onPress={() => handleLongPress(item)}
                        >
                            {
                                item?.profile ? <Image source={{ uri: item?.profile }} style={styles.avatar} /> :
                                    <View style={[styles.avatar, {
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#B0BEC5"
                                    }]}>
                                        <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
                                    </View>
                            }

                            <View style={{
                                flex: 1,
                                justifyContent: "space-between",
                                alignItems: 'center',
                                flexDirection: "row",
                            }}>
                                <View style={{
                                    justifyContent: "space-between",
                                    paddingStart: 5,
                                }}>
                                    <Text style={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>{currentUser?.userId === item?.id ? "You" : item?.name}</Text>

                                    {item?.bio && <Text style={{
                                        fontSize: 14,
                                        color: "gray",
                                        flex: 1,
                                    }} numberOfLines={1}>
                                        {item?.bio}
                                    </Text>}

                                </View>
                                {isUserAdmin && <View style={styles.badge}>
                                    <Text style={styles.text}>Group Admin</Text>
                                </View>}
                            </View>
                        </TouchableOpacity>
                    }}
                    ListFooterComponent={() => {
                        return !isSearching && <>
                            {!showAllMembers && chatDetails?.users?.length > 10 && (
                                <TouchableOpacity onPress={() => setShowAllMembers(true)} style={styles.viewAllButton}>
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            )}

                            {/* FAVORITE, EXIT & REPORT */}
                            <TouchableOpacity style={[styles.actionButton, { marginTop: 10, borderTopWidth: 0.5, borderColor: COLORS.LIGHT_GRAY }]} onPress={() => handleOptionPress("Add to Favorites")}>
                                <MaterialIcons name="star-border" size={24} color="black" />
                                <Text style={styles.actionText}>Add to Favorites</Text>
                            </TouchableOpacity>

                            {chatDetails?.isGroup && <TouchableOpacity style={[styles.actionButton, styles.exitButton]} onPress={() => handleOptionPress("Exit Group")}>
                                <MaterialIcons name="exit-to-app" size={24} color="red" />
                                <Text style={[styles.actionText, { color: "red" }]}>Exit Group</Text>
                            </TouchableOpacity>}

                            {!chatDetails?.isGroup && <TouchableOpacity style={[styles.actionButton, styles.exitButton]} onPress={() => handleOptionPress("Report User")}>
                                <MaterialIcons name="do-disturb-alt" size={24} color="red" />
                                <Text style={[styles.actionText, { color: "red" }]}>Block {chatDetails?.name}</Text>
                            </TouchableOpacity>}

                            {chatDetails?.isGroup && <TouchableOpacity style={[styles.actionButton, styles.reportButton]} onPress={() => handleOptionPress("Report Group")}>
                                <MaterialIcons name="report" size={24} color="red" />
                                <Text style={[styles.actionText, { color: "red" }]}>Report Group</Text>
                            </TouchableOpacity>}

                            {!chatDetails?.isGroup && <TouchableOpacity style={[styles.actionButton, styles.reportButton]} onPress={() => handleOptionPress("Report Group")}>
                                <AntDesign name="dislike2" size={24} color="red" style={{ transform: [{ scaleX: -1 }] }} />
                                <Text style={[styles.actionText, { color: "red" }]}>Report {chatDetails?.name}</Text>
                            </TouchableOpacity>}
                        </>
                    }}
                />
                {modalVisible && <Modal
                    transparent={true}
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={[styles.modalContent]}>
                                <TouchableOpacity style={styles.modalOption} onPress={handleMessage}>
                                    <Text style={styles.modalText}>Message {selectedUser?.name}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.modalOption} onPress={handleViewProfile}>
                                    <Text style={styles.modalText}>View {selectedUser?.name}</Text>
                                </TouchableOpacity>

                                {isGroupAdmin && <TouchableOpacity style={styles.modalOption} onPress={() => {
                                    // removeContact(selectedUser?.id);
                                    setModalVisible(false);
                                    setConfirmationModal(GROUP_MODAL_TYPES.REMOVE)
                                }}>
                                    <Text style={[styles.modalText, { color: COLORS.RED }]}>Remove {`${selectedUser?.name}`}</Text>
                                </TouchableOpacity>}

                                {isGroupAdmin && <TouchableOpacity style={styles.modalOption} onPress={chatDetails?.groupAdmins?.includes(selectedUser?.id) ? handleRemoveAdmin: handleMakeAdmin}>
                                    <Text style={styles.modalText}>{chatDetails?.groupAdmins?.includes(selectedUser?.id)? "Dismiss as admin" : "Make Group Admin"}</Text>
                                </TouchableOpacity>}

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>}
            </View>
            {confirmationModal === GROUP_MODAL_TYPES.REMOVE && <ConfirmationModal visible={confirmationModal === GROUP_MODAL_TYPES.REMOVE}
                onClose={() => setConfirmationModal('')}
                onConfirm={handleRemove}
                headingText=""
                subHeading={`Remove ${selectedUser?.name} from "${chatDetails?.name}" group`}
                confirmText="OK"
                confirmBackgroundColor={"red"} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.PURE_WHITE, paddingHorizontal: 15 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    avatar: {
        width: ms(50),
        height: ms(50),
        borderRadius: 25,
        marginRight: 10,
    },
    badge: {
        backgroundColor: COLORS.SKY_BLUE,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    text: {
        color: "white",
        fontSize: 10,
    },
    groupInfo: { alignItems: "center", marginVertical: 15 },
    groupImage: { width: 170, height: 170, borderRadius: 85 },
    defaultAvatar: { width: 170, height: 170, borderRadius: 85, backgroundColor: "#B0BEC5", justifyContent: "center", alignItems: "center" },
    groupName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
    memberCount: { fontSize: 14, color: "gray" },

    sectionTitle: { fontSize: 14, color: COLORS.DARK_SLATE_GRAY, marginTop: 20 },
    mediaScroll: { flexDirection: "row", marginVertical: 10 },
    mediaItem: { alignItems: "center", marginRight: 20 },
    mediaText: { fontSize: 14, marginTop: 5 },

    membersHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5, },
    searchIcon: { padding: 5 },

    memberRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#ddd" },
    memberName: { marginLeft: 10, fontSize: 16 },

    viewAllButton: { paddingVertical: 10, alignItems: "center" },
    viewAllText: { fontSize: 16, color: "#007AFF", fontWeight: "bold" },

    actionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
    actionText: { fontSize: 16, marginLeft: 10 },

    exitButton: { marginTop: 5 },
    reportButton: { marginTop: 5 },
    headerImage: {
        borderRadius: IMAGE_SIZE / 2,
        position: "absolute",
        left: 50,
        top: 20,
    },
    searchInput: {
        height: 40,
        backgroundColor: "transparent",
        borderRadius: 10,
        paddingHorizontal: 15,
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalOption: {
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        color: "#000",
    },
});