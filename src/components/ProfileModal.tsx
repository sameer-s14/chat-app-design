import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { hs, ms } from "../utils";
import ProfilePic from "./ProfilePic";

const ProfileModal = ({ visible, onClose, chatInfo, onImagePress, onMessagePress, onInfoPress }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Tap outside to close */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    {/* Prevent event bubbling */}
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            {/* Image Section */}
                            <TouchableOpacity activeOpacity={1} onPress={onImagePress} style={styles.imageContainer}>
                                {chatInfo?.image ? <Image
                                    source={{ uri: chatInfo?.image }}
                                    style={styles.image}
                                    resizeMode="cover" // Ensure the image covers the container
                                /> :
                                    <ProfilePic name={chatInfo?.name} textStyle={{ fontSize: 100 }} size={ms(250)} style={{ marginTop: hs(30) }} onPress={onImagePress} />
                                }
                                {/* Chat Name Overlay */}
                                <View style={styles.chatNameContainer}>
                                    <Text style={styles.chatName}>{chatInfo?.name || ""}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Icons Section */}
                            <View style={styles.iconsContainer}>
                                <TouchableOpacity style={styles.iconButton} onPress={onMessagePress}>
                                    <Ionicons name="chatbubble-outline" size={25} color={COLORS.PRIMARY} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Ionicons name="call-outline" size={25} color={COLORS.PRIMARY} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Ionicons name="videocam-outline" size={28} color={COLORS.PRIMARY} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} onPress={onInfoPress}>
                                    <Ionicons
                                        name="information-circle-outline"
                                        size={30}
                                        color={COLORS.PRIMARY}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        height: "60%",
        backgroundColor: COLORS.WHITE,
        // borderRadius: 15,
        overflow: "hidden", // Ensure the image doesn't overflow
    },
    imageContainer: {
        flex: 1,
        position: "relative",
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    chatNameContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)", // Semi-transparent overlay
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    chatName: {
        fontSize: 18,
        color: COLORS.WHITE,
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: COLORS.LIGHT_GRAY,
    },
    iconButton: {
        padding: 10,
    },
});

export default ProfileModal;