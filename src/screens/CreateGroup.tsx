import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Platform,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { hs, ms, ws } from "../utils";
import * as ImagePicker from "expo-image-picker";
import { useCreateGroupChatMutation } from "../api";
import Header from "../components/Header";

const CreateGroup = ({ navigation, route }) => {
    const [createGroupChat] = useCreateGroupChatMutation();
    const { selectedContacts } = route.params || {};
    const selectedUsersList = Object.values(selectedContacts || {});
    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);

    const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                "Permission required",
                "You need to grant camera roll access to change your profile picture."
            );
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (pickerResult?.assets[0]) {
            setGroupImage(pickerResult?.assets[0]);
        }
    };

    async function handleSubmit() {
        try {
            const formData = new FormData();
            formData.append('name', groupName);
            if (groupImage) {
                const adjustedUri =
                    Platform.OS === 'android' ? groupImage?.uri : groupImage?.uri.replace('file://', '');
                formData.append("file", {
                    uri: adjustedUri,
                    name: groupImage.name || "upload.jpg",
                    type: groupImage.mimeType || "image/jpeg",
                } as any);
            }
            const usersArray = Object.keys(selectedContacts);

            if (usersArray.length === 1) {
                formData.append('users[]', usersArray[0]);
            } else if (usersArray.length > 1) {
                usersArray.forEach(userId => formData.append('users[]', userId));
            }
            const { error, data } = await createGroupChat(formData);
            console.log(">>>>>>>>>>>.", error, formData, data)
            if (!error) {
                console.log(">ASDASDa", data)
                navigation.navigate("MessagesList", { chatId: data?.data?.chatId, })
            }
        } catch (err) {
            console.log(">>>>>>>>>..", err)
        }
    }

    const disableSubmit = !groupName || !selectedUsersList?.length;
    return (
        <SafeAreaView style={styles.container}>
            <Header backHandler={() => navigation.goBack()} borderBottomWidth={0} heading="New group" />
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {groupImage ? (
                        <Image source={{ uri: groupImage?.uri }} style={styles.groupImage} />
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
                                    {item?.profile ?
                                        <Image source={{ uri: item.profile }} style={[styles.selectedAvatar]} />
                                        :
                                        <View style={[styles.defaultAvatar, styles.selectedAvatar]}>
                                            <FontAwesome6 name="user-large" size={20} color={COLORS.WHITE} />
                                        </View>}
                                    <Text style={styles.selectedName} numberOfLines={1}>{item?.name}</Text>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
            <TouchableOpacity
                style={[styles.fabButton, disableSubmit && { backgroundColor: COLORS.LIGHT_GRAY }]}
                disabled={disableSubmit}
                onPress={handleSubmit}>
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
        width: ms(55),
        height: ms(55),
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
    defaultAvatar: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#B0BEC5",
    },
});

export default CreateGroup;
