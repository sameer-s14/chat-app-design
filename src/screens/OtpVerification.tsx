import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { COLORS, Font } from "../constants";
import { OtpInput } from "react-native-otp-entry";
import { hs, ws } from "../utils";
import { useVerifyOtpMutation } from "../api/auth.api";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

const OtpVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { phone, countryCode } = route?.params || {};
  const dispatch = useDispatch();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleVerifyOtp = async () => {
    try {
      if (otp.length !== 5) {
        throw new Error("OTP must be exactly 5 digits");
      }

      const { error, data } = await verifyOtp({ phone, countryCode, otp });
      if (error?.data?.message) {
        return setErrorMessage(error?.data?.message);
      }

      const { token, ...user } = data?.data || {};
      dispatch(setCredentials({ token, user }));
      if (user?.name) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("NameInputScreen");
      }
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Enter the 5-digit code sent to your phone
      </Text>

      <View style={styles.otpContainer}>
        <OtpInput
          numberOfDigits={5}
          focusColor={COLORS.PRIMARY}
          focusStickBlinkingDuration={500}
          onTextChange={setOtp}
          onFilled={(text) => {
            setOtp(text);
            Keyboard.dismiss();
          }}
          textInputProps={{ accessibilityLabel: "One-Time Password" }}
          type="numeric"
          theme={{
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
      </View>

      {<Text style={styles.errorText}>{errorMessage}</Text>}
      <TouchableOpacity
        style={[styles.button, otp.length !== 5 && styles.disabledButton]}
        onPress={handleVerifyOtp}
        disabled={otp.length !== 5}
      >
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
      {isLoading && <Loader />}
    </View>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  pinCodeContainer: {
    borderWidth: 2,
    width: ws(55),
    height: hs(70),
  },
  pinCodeText: {
    color: COLORS.PRIMARY,
    fontSize: 36,
    fontWeight: "400",
    fontFamily: Font.RUBIK,
  },
  activePinCodeContainer: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    width: ws(55),
    height: hs(70),
  },
  errorText: {
    fontSize: 14,
    color: COLORS.RED,
    textAlign: "center",
  },
});
