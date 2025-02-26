import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { hs, ms, ws } from "../utils";

const CreateGroup = ({ navigation, route }) => {
    const { selectedContacts } = route.params || {};
    const selectedUsersList = Object.values(selectedContacts || {});
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);

    const pickImage = async () => {
        // Image picker logic
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={25} color={COLORS.BLACK} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New group</Text>
                </View>
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {groupImage ? (
                        <Image source={{ uri: groupImage }} style={styles.groupImage} />
                    ) : (
                        <Ionicons name="camera" size={25} color={COLORS.DARK_SLATE_GRAY} />
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Enter group name"
                    value={groupName}
                    onChangeText={setGroupName}
                    maxLength={100}
                />

                <Text style={styles.charLimit}>{100 - groupName.length}</Text>
            </View>

            <View style={{ flex: 1 }}>
                {selectedUsersList?.length > 0 && (
                    <View style={styles.selectedContainer}>
                        <Text style={{ marginVertical: 10, fontWeight: 500, color: COLORS.DARK_SLATE_GRAY }}>{selectedUsersList?.length + " members"} </Text>
                        <FlatList
                            data={selectedUsersList}
                            keyExtractor={(item) => item.id}
                            numColumns={4}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1 }}
                            renderItem={({ item }) => (
                                <View style={styles.selectedItem}>
                                    <View style={{ width: ms(55) }}>
                                        <Image source={{ uri: item.avatar }} style={styles.selectedAvatar} />
                                    </View>
                                    <Text style={styles.selectedName} numberOfLines={1}>{item?.name}</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={styles.fabButton}
                onPress={() => navigation.navigate("CreateGroup", { selectedContacts })}

            >
                <Ionicons name="checkmark" size={20} color={COLORS.WHITE} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.WHITE },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderColor: COLORS.LIGHT_GRAY
    },
    groupImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    charLimit: {
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.GRAY,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderBottomColor: COLORS.LIGHT_GRAY,
        height: hs(60),
    },
    fabButton: {
        position: "absolute",
        bottom: hs(20),
        right: ws(20),
        width: ms(60),
        height: ms(60),
        borderRadius: 30,
        backgroundColor: COLORS.PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 3,
    },
    headerTitle: {
        marginHorizontal: 10,
        fontSize: 18,
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.DARK_SLATE_GRAY,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.PRIMARY,
        marginHorizontal: 10,
    },
    imagePicker: {
        alignSelf: "center",
        width: ms(50),
        height: ms(50),
        borderRadius: 50,
        backgroundColor: COLORS.LIGHT_GRAY,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedContainer: {
        backgroundColor: COLORS.PALE_GRAY,
        flex: 1,
        flexShrink: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: COLORS.LIGHT_GRAY,
    },
    selectedItem: {
        alignItems: "center",
        margin: 10,
        width: ws(70),
    },
    avatarContainer: {
        position: "relative",
        width: ms(55),
    },
    selectedAvatar: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    selectedName: {
        fontSize: 12,
        textAlign: "center",
        marginTop: 5,
        color: COLORS.DARK_SLATE_GRAY
    },
    createButton: {
        backgroundColor: COLORS.PRIMARY,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    createButtonText: {
        color: COLORS.WHITE,
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CreateGroup;
