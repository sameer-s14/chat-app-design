import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../constants';
import { ms } from "../utils";

const Avatar = ({ imageUrl, icon = "person", size = 45, backgroundColor = COLORS.PRIMARY, iconColor = COLORS.WHITE, iconSize = 45 }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <View style={[styles.avatarContainer, { width: size, height: size, borderRadius: size / 2, backgroundColor }]}>
            {imageUrl && !imageError ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, { width: ms(iconSize || size), height: ms(iconSize || size), borderRadius: (iconSize || size) / 2 }]}
                    onError={() => setImageError(true)}
                />
            ) : (
                <Ionicons name={icon} size={(iconSize || size) * 0.6} color={iconColor} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginRight: 10,
    },
    image: {
        resizeMode: "cover",
    },
});

export default Avatar;
