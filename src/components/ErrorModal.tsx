import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { hs, ws } from "../utils";
import { COLORS } from "../constants";

const ErrorModal = ({ isVisible, message, onClose }) => {
    return (
        <Modal transparent visible={isVisible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>

                    {/* Error Message */}
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.errorText}>{message}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: ws(300),
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        height: hs(200),
        alignItems: "center",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 15,
        padding: 5,
    },
    closeText: {
        fontSize: 24,
        color: "black",
    },
    errorText: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 20,
    },
});

export default ErrorModal;
