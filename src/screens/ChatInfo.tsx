import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    TextInput,
    Modal,
    Dimensions,
    Animated,
    Easing,
    Platform,
    Vibration,
} from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, MaterialCommunityIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddAdminMutation, useCreateOneToOneChatMutation, useGetChatDetailsQuery, useRemoveAdminMutation, useRemoveMembersMutation } from "../api";
import { COLORS } from "../constants";
import TabItem from "../components/TabItem";
import { ms, width } from "../utils";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useSelector } from "react-redux";
import ProfilePic from "../components/ProfilePic";

const IMAGE_SIZE = 90;
const GROUP_MODAL_TYPES = {
    REMOVE: 'remove'
};

export default function ChatInfo({ navigation, route }) {
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState('');
    const [createOneToOneChat] = useCreateOneToOneChatMutation();
    const [addAdmin] = useAddAdminMutation();
    const [removeAdmin] = useRemoveAdminMutation();
    const currentUser = useSelector((state) => state?.auth?.user);
    const [removeMembers] = useRemoveMembersMutation();

    const { chatId } = route?.params;
    const { data, error } = useGetChatDetailsQuery(chatId);
    const chatDetails = data?.data || {};

    const usersList = chatDetails?.users?.filter((user) =>
        !searchTerm || user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isGroupAdmin = chatDetails?.groupAdmins?.includes(currentUser?.userId);

    // Animation for modal
    const modalScale = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openModal = () => {
        setModalVisible(true);
        Animated.parallel([
            Animated.timing(modalScale, {
                toValue: 1,
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeModal = () => {
        Animated.parallel([
            Animated.timing(modalScale, {
                toValue: 0,
                duration: 200,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setModalVisible(false));
    };

    const handleLongPress = (item) => {
        Vibration.vibrate(50); // Haptic feedback
        setSelectedUser(item);
        openModal();
    };

    const toggleSearch = () => {
        setIsSearching((prev) => !prev);
        setSearchTerm("");
    };

    const handleRemove = async () => {
        try {
            await removeMembers({ chatId: chatDetails?._id, body: { participants: [selectedUser?.id] } });
        } catch (err) {
            console.log('ERROR IN REMOVING USER', err);
        }
        setConfirmationModal('');
    };

    const handleMessage = async () => {
        try {
            const { data } = await createOneToOneChat(selectedUser?.id).unwrap();
            navigation.navigate("MessagesList", { chatId: data?.chatId });
        } catch (err) {
            console.log('ERROR IN MESSAGE', err);
        }
        closeModal();
    };

    const handleMakeAdmin = async () => {
        try {
            await addAdmin({ chatId, body: { users: [selectedUser?.id] } });
        } catch (err) {
            console.log('ERROR IN MAKING ADMIN', err);
        }
        closeModal();
    };

    const handleRemoveAdmin = async () => {
        try {
            await removeAdmin({ chatId, body: { users: [selectedUser?.id] } });
        } catch (err) {
            console.log('ERROR IN REMOVING ADMIN', err);
        }
        closeModal();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            {isSearching ? (
                <View style={styles.header}>
                    <TouchableOpacity onPress={toggleSearch}>
                        <Ionicons name="arrow-back" size={25} color={COLORS.BLACK} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        autoFocus={true}
                    />
                </View>
            ) : (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert("Options", "You selected: Options")}>
                        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.BLACK} />
                    </TouchableOpacity>
                </View>
            )}

            {/* CONTENT */}
            <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    !isSearching && (
                        <>
                            {/* GROUP IMAGE & NAME */}
                            <View style={styles.groupInfo}>
                                <ProfilePic image={chatDetails?.image} name={chatDetails?.name} size={150} textStyle={{ fontSize: 100 }} />
                                <Text style={styles.groupName}>{chatDetails?.name}</Text>
                                {chatDetails?.isGroup && <Text style={styles.memberCount}>{chatDetails?.users?.length} members</Text>}
                            </View>

                            {/* ACTION BUTTONS */}
                            <View style={styles.rowContainer}>
                                <TabItem
                                    boxSize={70}
                                    Icon={<MaterialCommunityIcons name="phone-outline" size={24} color={COLORS.PRIMARY} />}
                                    heading="Audio"
                                    onPress={() => console.log("Audio Pressed")}
                                />
                                <TabItem
                                    boxSize={70}
                                    Icon={<MaterialCommunityIcons name="video-outline" size={24} color={COLORS.PRIMARY} />}
                                    heading="Video"
                                    onPress={() => console.log("Video Pressed")}
                                />
                                {chatDetails?.isGroup && (
                                    <TabItem
                                        boxSize={70}
                                        Icon={<Feather name="user-plus" size={24} color={COLORS.PRIMARY} />}
                                        heading="Add"
                                        onPress={() => navigation.navigate('AddMembers', { chatId, userIds: chatDetails?.users?.map((data) => data?.id) })}
                                    />
                                )}
                                <TabItem
                                    boxSize={70}
                                    Icon={<Ionicons name="search" size={20} color={COLORS.PRIMARY} />}
                                    heading="Search"
                                    onPress={toggleSearch}
                                />
                            </View>

                            {/* MEDIA, LINKS & DOCS */}
                            <Text style={styles.sectionTitle}>Media, Links & Docs</Text>
                            <View style={styles.mediaScroll}>
                                {[
                                    { id: "1", type: "photo", count: 25 },
                                    { id: "2", type: "video", count: 10 },
                                    { id: "3", type: "docs", count: 5 },
                                ].map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.mediaItem}>
                                        <FontAwesome name={item.type === "photo" ? "image" : item.type === "video" ? "video-camera" : "file-text"} size={30} color={COLORS.PRIMARY} />
                                        <Text style={styles.mediaText}>{item.count}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* MEMBERS LIST */}
                            {chatDetails?.isGroup && (
                                <View style={styles.membersHeader}>
                                    <Text style={styles.sectionTitle}>{chatDetails?.users?.length} Members</Text>
                                    <TouchableOpacity onPress={toggleSearch} style={styles.searchIcon}>
                                        <Ionicons name="search" size={16} color={COLORS.BLACK} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )
                )}
                data={chatDetails?.isGroup ? (showAllMembers ? usersList : usersList?.slice(0, 10)) : []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const isUserAdmin = chatDetails?.groupAdmins?.includes(item?.id);
                    return (
                        <TouchableOpacity
                            disabled={currentUser?.userId === item?.id}
                            style={styles.memberRow}
                            onLongPress={() => handleLongPress(item)}
                            onPress={() => handleLongPress(item)}
                        >
                            {item?.profile ? (
                                <Image source={{ uri: item?.profile }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.defaultMemberAvatar]}>
                                    <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
                                </View>
                            )}
                            <View style={styles.memberDetails}>
                                <Text style={styles.memberName}>{currentUser?.userId === item?.id ? "You" : item?.name}</Text>
                                {item?.bio && <Text style={styles.memberBio} numberOfLines={1}>{item?.bio}</Text>}
                            </View>
                            {isUserAdmin && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>Group Admin</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                }}
                ListFooterComponent={() => (
                    !isSearching && (
                        <>
                            {!showAllMembers && chatDetails?.users?.length > 10 && (
                                <TouchableOpacity onPress={() => setShowAllMembers(true)} style={styles.viewAllButton}>
                                    <Text style={styles.viewAllText}>View All</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Add to Favorites")}>
                                <MaterialIcons name="star-border" size={24} color={COLORS.BLACK} />
                                <Text style={styles.actionText}>Add to Favorites</Text>
                            </TouchableOpacity>

                            {chatDetails?.isGroup ? (
                                <>
                                    <TouchableOpacity style={[styles.actionButton, styles.exitButton]} onPress={() => Alert.alert("Exit Group")}>
                                        <MaterialIcons name="exit-to-app" size={24} color={COLORS.RED} />
                                        <Text style={[styles.actionText, { color: COLORS.RED }]}>Exit Group</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, styles.reportButton]} onPress={() => Alert.alert("Report Group")}>
                                        <MaterialIcons name="report" size={24} color={COLORS.RED} />
                                        <Text style={[styles.actionText, { color: COLORS.RED }]}>Report Group</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity style={[styles.actionButton, styles.exitButton]} onPress={() => Alert.alert("Block User")}>
                                        <MaterialIcons name="do-disturb-alt" size={24} color={COLORS.RED} />
                                        <Text style={[styles.actionText, { color: COLORS.RED }]}>Block {chatDetails?.name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, styles.reportButton]} onPress={() => Alert.alert("Report User")}>
                                        <AntDesign name="dislike2" size={24} color={COLORS.RED} style={{ transform: [{ scaleX: -1 }] }} />
                                        <Text style={[styles.actionText, { color: COLORS.RED }]}>Report {chatDetails?.name}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </>
                    )
                )}
            />

            {/* MODALS */}
            {modalVisible && (
                <Modal transparent={true} animationType="fade" visible={modalVisible} onRequestClose={closeModal}>
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                            <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }] }]}>
                                <TouchableOpacity style={styles.modalOption} onPress={handleMessage}>
                                    <Text style={styles.modalText}>Message {selectedUser?.name}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalOption} onPress={() => navigation.navigate("UserProfile", { userId: selectedUser?.id })}>
                                    <Text style={styles.modalText}>View {selectedUser?.name}</Text>
                                </TouchableOpacity>
                                {isGroupAdmin && (
                                    <>
                                        <TouchableOpacity style={styles.modalOption} onPress={() => {
                                            closeModal();
                                            setConfirmationModal(GROUP_MODAL_TYPES.REMOVE);
                                        }}>
                                            <Text style={[styles.modalText, { color: COLORS.RED }]}>Remove {selectedUser?.name}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.modalOption} onPress={chatDetails?.groupAdmins?.includes(selectedUser?.id) ? handleRemoveAdmin : handleMakeAdmin}>
                                            <Text style={styles.modalText}>{chatDetails?.groupAdmins?.includes(selectedUser?.id) ? "Dismiss as admin" : "Make Group Admin"}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}

            {confirmationModal === GROUP_MODAL_TYPES.REMOVE && (
                <ConfirmationModal
                    visible={confirmationModal === GROUP_MODAL_TYPES.REMOVE}
                    onClose={() => setConfirmationModal('')}
                    onConfirm={handleRemove}
                    headingText=""
                    subHeading={`Remove ${selectedUser?.name} from "${chatDetails?.name}" group`}
                    confirmText="OK"
                    confirmBackgroundColor={COLORS.RED}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.PURE_WHITE, paddingHorizontal: 15 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
    searchInput: { flex: 1, height: 40, backgroundColor: COLORS.SOFT_GRAY, borderRadius: 20, paddingHorizontal: 15, marginLeft: 10 },
    groupInfo: { alignItems: "center", marginVertical: 15 },
    groupImage: { width: 170, height: 170, borderRadius: 85 },
    defaultAvatar: { width: 170, height: 170, borderRadius: 85, backgroundColor: COLORS.PRIMARY, justifyContent: "center", alignItems: "center" },
    groupName: { fontSize: 22, fontWeight: "bold", marginTop: 10, color: COLORS.TEXT_DARK },
    memberCount: { fontSize: 14, color: COLORS.TEXT_LIGHT, marginTop: 5 },
    rowContainer: { flexDirection: "row", justifyContent: "space-around", padding: 10 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.TEXT_DARK, marginTop: 20 },
    mediaScroll: { flexDirection: "row", marginVertical: 10 },
    mediaItem: { alignItems: "center", marginRight: 20 },
    mediaText: { fontSize: 14, marginTop: 5, color: COLORS.TEXT_DARK },
    membersHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
    searchIcon: { padding: 5 },
    memberRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
    avatar: { width: ms(50), height: ms(50), borderRadius: 25, marginRight: 10 },
    defaultMemberAvatar: { backgroundColor: COLORS.SKY_BLUE, justifyContent: "center", alignItems: "center" },
    memberDetails: { flex: 1, justifyContent: "space-between" },
    memberName: { fontSize: 16, fontWeight: "bold", color: COLORS.TEXT_DARK },
    memberBio: { fontSize: 14, color: COLORS.TEXT_LIGHT },
    badge: { backgroundColor: COLORS.SKY_BLUE, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
    badgeText: { fontSize: 12, color: COLORS.WHITE },
    viewAllButton: { paddingVertical: 10, alignItems: "center" },
    viewAllText: { fontSize: 16, color: COLORS.PRIMARY, fontWeight: "bold" },
    actionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderTopWidth: 0.5, borderColor: COLORS.LIGHT_GRAY },
    actionText: { fontSize: 16, marginLeft: 10, color: COLORS.TEXT_DARK },
    exitButton: { marginTop: 5 },
    reportButton: { marginTop: 5 },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { width: "80%", backgroundColor: COLORS.WHITE, borderRadius: 10, padding: 20 },
    modalOption: {
        paddingVertical: 10, width: "100%", alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        color: "#000",
    },
});