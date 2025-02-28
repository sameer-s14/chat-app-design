import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { StyleSheet } from "react-native";
import { COLORS } from "../constants";

const CreateContact = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header heading="New Contact" backHandler={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.WHITE },
});

export default CreateContact;
