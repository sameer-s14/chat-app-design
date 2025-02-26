import {
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../constants";
import { useSelector } from "react-redux";

const SplashScreen = ({ navigation }) => {
  const { token, user } = useSelector((state) => state?.auth);
  useEffect(() => {
    const timer = setTimeout(() => {
      //   if (!deepLinkProcessed) {
      let route = "Login";
      if (token) {
        if (!user?.name) {
            route = "NameInputScreen"
        } else {
          route = "Home";
        }
      }
      navigation.replace(route);
      //   }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Chat App</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
  },
  heading: {
    fontSize: 33,
    fontWeight: "400",
    color: COLORS.WHITE,
    marginTop: 10,
  },
});
