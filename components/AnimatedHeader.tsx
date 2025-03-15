import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { COLORS, MESSAGE_TYPES } from "@/src/constants";

const AnimatedHeader = ({ selectedMessages, onBack, onReply, onCopy, onDelete, onForward }) => {
    const headerHeight = useRef(new Animated.Value(0)).current; // Initial height is 0
    const selectedMessagesList = Object.values(selectedMessages);

    const isHeaderVisible = selectedMessagesList?.length > 0; // Header is visible if there are selected messages
    const hasFiles = selectedMessagesList?.find((message) => message?.type === MESSAGE_TYPES.FILE);

    useEffect(() => {
        // Animate the header height only when the header appears or disappears
        Animated.timing(headerHeight, {
            toValue: isHeaderVisible ? 60 : 0, // Adjust height as needed
            duration: 100, // Animation duration
            useNativeDriver: false, // Height animation doesn't support native driver
        }).start();
    }, [isHeaderVisible]); // Trigger animation only when visibility changes

    return (
        <Animated.View style={[styles.animatedHeader, { height: headerHeight }]}>
            <TouchableOpacity onPress={onBack} style={{ marginEnd: 10 }}>
                <Ionicons name="arrow-back" size={24} color={COLORS.BLACK} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{selectedMessagesList?.length || 0}</Text>
            <View style={styles.headerIcons}>
                {selectedMessagesList?.length === 1 && <TouchableOpacity onPress={onReply} style={styles.iconButton}>
                    <Octicons name="reply" size={22} color="black" />
                </TouchableOpacity>}
                {!hasFiles && <TouchableOpacity onPress={onCopy} style={styles.iconButton}>
                    <MaterialCommunityIcons name="content-copy" size={22} color="black" />
                </TouchableOpacity>}
                <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
                    <MaterialCommunityIcons name="delete-outline" size={26} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onForward} style={styles.iconButton}>
                    <Octicons name="reply" size={22} color="black" style={{ transform: [{ scaleX: -1 }] }} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    animatedHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderColor: COLORS.SOFT_GRAY,
        overflow: "hidden", // Ensure the content doesn't overflow during animation
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.TEXT_DARK,
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
        marginStart: 'auto'
    },
    iconButton: {
        marginHorizontal: 10,
    },
});

export default AnimatedHeader;