import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const ImageFullScreen = ({ route, navigation }) => {
  const { image } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Image or Fallback Text */}
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain" // Ensure the image fits within the screen
        />
      ) : (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>No Image</Text>
        </View>
      )}

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={25} color={COLORS.WHITE} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BLACK, // Background color to wrap the image
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BLACK, // Placeholder background color
    width: "100%",
    height: "100%",
  },
  fallbackText: {
    fontSize: 16,
    color: COLORS.LIGHT_GRAY,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 20,
    padding: 10,
  },
});

export default ImageFullScreen;