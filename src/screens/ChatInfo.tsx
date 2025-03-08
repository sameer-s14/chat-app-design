import React, { useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons, AntDesign, MaterialCommunityIcons, Feather, FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetChatDetailsQuery } from "../api";
import { COLORS } from "../constants";
import TabItem from "../components/TabItem";
import { ms } from "../utils";

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

export default function ChatInfo({ navigation, route }) {
    const [showAllMembers, setShowAllMembers] = useState(false);

    const handleOptionPress = (option) => {
        Alert.alert(option, `You selected: ${option}`);
    };
    const { chatId } = route?.params

    const { data, error } = useGetChatDetailsQuery(chatId);
    const chatDetails = data?.data || {};
    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOptionPress("Options")}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={() => {
                        return <>
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
                                        onPress={() => console.log("Home Pressed")}
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
                                <TouchableOpacity onPress={() => handleOptionPress("Search")} style={styles.searchIcon}>
                                    <Ionicons name="search" size={16} color="black" />
                                </TouchableOpacity>
                            </View>}
                        </>
                    }}
                    style={{ flex: 1 }}
                    data={chatDetails?.isGroup ? (showAllMembers ? chatDetails?.users : chatDetails?.users?.slice(0, 10)) : []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                paddingVertical: 15,
                            }}
                            onPress={() => navigation.navigate("MessagesList", { chatId: item?._id, name: item?.name, image: item?.profile })}
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
                                justifyContent: "center"
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}>
                                    <Text style={{
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}>{item?.name}</Text>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 4
                                }}>
                                    {item?.bio && <Text style={{
                                        fontSize: 14,
                                        color: "gray",
                                        flex: 1,
                                    }} numberOfLines={1}>
                                        {item?.bio}
                                    </Text>}

                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => {
                        return <>
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.PURE_WHITE, paddingHorizontal: 15 },
    header: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15 },
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
});