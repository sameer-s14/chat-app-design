import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [image, setImage] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity style={styles.profileContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultProfile}>
            <Text style={styles.profileInitial}>JD</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* User Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name: John Doe</Text>
        <Text style={styles.infoText}>Email: johndoe@example.com</Text>
        <Text style={styles.infoText}>Phone: +91 9876543210</Text>
      </View>

      {/* Edit Profile Button */}
      <Button title="Edit Profile" onPress={() => alert("Edit Profile")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 24,
    color: "#fff",
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
