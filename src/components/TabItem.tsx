import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants";

const TabItem = ({ boxSize, Icon, heading, onPress }) => {
    return (
        <TouchableOpacity style={[styles.container, { width: boxSize, height: boxSize }]} onPress={onPress}>
            {Icon}
            <Text style={styles.text}>{heading}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.PURE_WHITE,
        borderWidth: 0.5,
        borderColor: COLORS.LIGHT_GRAY,
        borderRadius: 10,
        margin: 5,
    },
    text: {
        marginTop: 5,
        fontSize: 14,
        textAlign: "center",
    },
});

export default TabItem;
