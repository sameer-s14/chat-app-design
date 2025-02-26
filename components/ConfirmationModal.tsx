import { COLORS } from "@/src/constants";
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  confirmBackgroundColor,
  confirmText = "Logout",
  headingText = "Are you sure?",
  subHeading = "You are about to log out of your account.",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>{headingText}</Text>
          <Text style={styles.modalSubHeading}>{subHeading}</Text>
          <View style={[styles.buttonContainer]}>
            <TouchableOpacity onPress={onClose} style={{}}>
              <Text
                style={[
                  styles.buttonText,
                  { color: COLORS.DARK_SLATE_GRAY, fontWeight: 400 },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.button,
                { backgroundColor: confirmBackgroundColor || COLORS.PRIMARY },
              ]}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalHeading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 500,
    color: COLORS.BLACK,
  },
  modalSubHeading: {
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.DARK_SLATE_GRAY,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 10,
    padding: 5,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.WHITE,
  },
});

export default ConfirmationModal;
