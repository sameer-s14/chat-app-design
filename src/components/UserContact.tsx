import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useGetUserContactsQuery } from "../api";
import { useEffect, useState } from "react";
import { fetchUserContacts } from "../utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS } from "../constants";

const UserContacts = ({ search, savedContactHeading, mobileContactHeading, searchType = "name", savedContactHandler }: any) => {
    const [contacts, setContacts] = useState([]);

    const { data } = savedContactHeading ? useGetUserContactsQuery(undefined, {
        // skip: contacts.length > 0,
    }) : { data: { data: { contacts: [] } } };
    const savedContacts = data?.data || {};

    useEffect(() => {
        if (mobileContactHeading) {
            fetchUserContacts().then((data) => setContacts(data || []));
        }
    }, []);

    const filteredConversations = savedContacts?.contacts?.filter((contact) =>
        !search || (
            searchType === "name"
                ? contact?.name?.toLowerCase().includes(search.toLowerCase())
                : contact?.phone?.includes(search)
        )
    );

    const filteredContacts = contacts?.filter((contact) =>
        (!search || (
            searchType === "name"
                ? contact?.name?.toLowerCase().includes(search.toLowerCase())
                : contact?.phoneNumbers?.some((num) => num?.number?.replaceAll(' ', '').includes(search))
        )) &&
        !savedContacts?.contacts?.some(saved => saved.phoneNumber === contact?.phoneNumbers?.[0]?.number?.replaceAll(' ', ''))
    );

    const sections = []
    if (savedContactHeading || (!savedContactHeading && !mobileContactHeading)) {
        sections?.push({
            title: savedContactHeading || '',
            data: filteredConversations || [],
            renderItem: ({ item }) => (
                <TouchableOpacity style={styles.chatItem} onPress={() => {
                    console.log({ item })
                    if (savedContactHandler) {
                        return savedContactHandler(item?.id)
                    }
                }}>
                    {item?.profile ? <Image source={{ uri: item.profile }} style={styles.avatar} /> : <View style={[styles.avatar, styles.defaultAvatar]}>
                        <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
                    </View>}
                    <View style={styles.chatDetails}>
                        <View style={styles.chatHeader}>
                            <Text style={styles.name}>{item.name}</Text>
                        </View>
                        <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                    </View>
                </TouchableOpacity>
            ),
        })
    }
    if (mobileContactHeading) {
        sections.push({
            title: mobileContactHeading,
            data: filteredContacts || [],
            renderItem: ({ item }) => {
                return (
                    <TouchableOpacity style={styles.chatItem}>
                        <View style={[styles.avatar, styles.defaultAvatar]}>
                            <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
                        </View>
                        <View style={styles.chatDetails}>
                            <View style={styles.chatHeader}>
                                <Text style={styles.name}>{item.name}</Text>
                                <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                    <Text style={{ fontSize: 12, color: COLORS.PRIMARY }}>Invite</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            },
        })
    }

    return <SectionList
        sections={sections}
        keyExtractor={(item, index) => item?._id || index.toString()}
        renderItem={({ section, item }) => section && section?.renderItem({ item })}
        renderSectionHeader={({ section }) => section?.data?.length > 0 ? <Text style={styles.sectionHeader}>{section?.title || 'Users'}</Text> : null}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
    />
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.WHITE },
    list: { paddingBottom: 20 },
    chatItem: {
        flexDirection: "row",
        padding: 10,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginRight: 10,
    },
    defaultAvatar: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#B0BEC5",
    },
    chatDetails: { flex: 1, justifyContent: "center" },
    chatHeader: { flexDirection: "row", justifyContent: "space-between" },
    name: { fontWeight: "bold", fontSize: 16 },
    time: { fontSize: 12, color: "gray" },
    lastMessage: { fontSize: 14, color: "gray", marginTop: 4 },
    sectionHeader: {
        paddingLeft: 10,
        paddingVertical: 5,
        fontWeight: 400,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
});
export default UserContacts;