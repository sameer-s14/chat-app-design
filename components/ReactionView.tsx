import React from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ReactionView = ({ modalPosition, modalOverlayStyle, visible, closeReactionView, onSelect }) => {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🙏", "😎", "😍", "🥰", "😘", "😡", "🤬"]; // Default reactions

  // Close the modal when tapping outside
  const closeModal = () => {
    closeReactionView();
  };

  return (
    <Modal transparent visible={!!visible} animationType="fade">
      <TouchableOpacity
        style={[styles.modalOverlay, modalOverlayStyle]}
        activeOpacity={1} // Prevent opacity change on press
        onPress={closeModal}
      >
        <View
          style={[
            styles.reactionContainer,
            { top: modalPosition.top, left: modalPosition.left },
          ]}
        >
          <FlatList
            data={reactions}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.reactionButton}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.reactionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reactionContainer: {
    position: "absolute",
    backgroundColor: "white",
    left: 0,
    right: 0,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reactionButton: {
    padding: 5,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  reactionText: {
    fontSize: 24,
  },
});

export default ReactionView;