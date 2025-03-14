import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { OtpInput } from "react-native-otp-entry";
import { COLORS, Font, RESEND_SEC } from "../constants";
import { hs, ws } from "../utils";
import { useLoginWithPhoneMutation, useVerifyOtpMutation } from "../api/auth.api";
import Loader from "../components/Loader";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { t } from "i18next";

const OtpVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { phone, countryCode } = route?.params || {};
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(RESEND_SEC);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [loginWithPhone] = useLoginWithPhoneMutation();
  const canResend = useRef(false);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend.current) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      canResend.current = true;
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer, canResend.current]);

  useEffect(() => {
    if (timer > 0) {
      Animated.timing(progress, {
        toValue: 0,
        duration: RESEND_SEC * 1000,
        useNativeDriver: false,
      }).start();
    }
  }, []);

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

  const handleResend = () => {
    const loginData = { phone: phone, countryCode: countryCode };
    loginWithPhone(loginData).unwrap();
    setTimer(RESEND_SEC);
    canResend.current = false;
    progress.setValue(1);
    Animated.timing(progress, {
      toValue: 0,
      duration: RESEND_SEC * 1000,
      useNativeDriver: false,
    }).start();
  };

  return (
    <LinearGradient
      colors={[COLORS.PRIMARY, COLORS.SECONDARY]}
      style={styles.container}
    >
      <Text style={styles.title}>{t("ENTER_VERIFICATION_CODE")}</Text>
      <Text style={styles.subtitle}>{t("ENTER_OTP_CODE_SENT")}</Text>

      <View style={styles.otpContainer}>
        <OtpInput
          numberOfDigits={5}
          focusColor={COLORS.ACCENT}
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

      <View style={styles.sendContainer}>
        <Text style={styles.sendText}>{t("DIDNT_RECEIVE_CODE")}</Text>
        {canResend.current ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.sendBtn}>{t("SEND_AGAIN")}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.sendTextTime}>{`${t("RESEND_IN")} ${timer}s`}</Text>
        )}
      </View>

      {/* Progress Bar for Resend Timer */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[styles.button, otp.length !== 5 && styles.disabledButton]}
        onPress={handleVerifyOtp}
        disabled={otp.length !== 5}
      >
        <Text style={styles.buttonText}>{t("VERIFY")}</Text>
      </TouchableOpacity>

      {isLoading && <Loader />}
    </LinearGradient>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.ACCENT,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: COLORS.ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  pinCodeContainer: {
    borderWidth: 2,
    width: ws(55),
    height: hs(70),
    borderRadius: 10,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  pinCodeText: {
    color: COLORS.WHITE,
    fontSize: 36,
    fontWeight: "400",
  },
  activePinCodeContainer: {
    borderColor: COLORS.ACCENT,
    borderWidth: 2,
    width: ws(55),
    height: hs(70),
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
    textAlign: "center",
    marginTop: 10,
  },
  sendContainer: {
    flexDirection: "row",
    gap: 5,
    marginHorizontal: 10,
    justifyContent: "center",
  },
  sendText: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.WHITE,
  },
  sendTextTime: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: "400",
  },
  sendBtn: {
    fontSize: 14,
    fontWeight: "400",
    color: COLORS.ACCENT,
  },
  progressBarContainer: {
    width: "80%",
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.ACCENT,
  },
});