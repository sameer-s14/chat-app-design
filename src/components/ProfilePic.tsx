import React from "react";
import { View, Image, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface ProfileProps {
  image?: string;
  name: string;
  isOnline?: boolean;
  size?: number; // Size of the profile
  style?: ViewStyle; // Custom styles for the container
  textStyle?: TextStyle; // Custom styles for the fallback text
}

const ProfilePic: React.FC<ProfileProps> = ({
  image,
  name,
  isOnline = false,
  size = 50,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.profileContainer, { width: size, height: size }, style]}>
      {image ? (
        <Image source={{ uri: image }} style={[styles.profile, { borderRadius: size / 2 }]} />
      ) : (
        <View style={[styles.profile, styles.defaultProfile, { borderRadius: size / 2 }]}>
          <Text style={[styles.profileText, textStyle]}>{name ? name[0] : ''}</Text>
        </View>
      )}
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    position: "relative",
    marginRight: 16,
  },
  profile: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultProfile: {
    backgroundColor: "#4CAF50", // Default background color for fallback profile
  },
  profileText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  onlineIndicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default ProfilePic;