import React, { useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateUserProfileMutation } from "../api";
import { updateUserDetails } from "../redux/authSlice";
import Octicons from '@expo/vector-icons/Octicons';
import Loader from "../components/Loader";
import CommonBottomSheet from "../components/CommonBottomSheet";
import { TouchableWithoutFeedback } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const aboutStatuses = [
    "Available",
    "Busy",
    "At work",
    "At the gym",
    "Sleeping",
    "On vacation",
    "Offline",
    "Feeling happy 😊",
    "Feeling sad 😞",
];

const MAX_ABOUT_LENGTH = 130;
const AboutScreen = ({ navigation }) => {
    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
    const { user } = useSelector((state) => state?.auth);
    const [about, setAbout] = useState(user?.bio);
    const bottomSheetRef = useRef(null);
    const inputRef = useRef(null);

    const openDetailBottomSheet = () => {
        bottomSheetRef.current?.expand();
        inputRef.current?.focus();
    };

    const closeBottomSheet = () => {
        Keyboard.dismiss()
        bottomSheetRef.current?.close();
    };

    // Save the new name and close modal
    const saveNewBio = () => {
        handleChangeAbout(about);
        closeBottomSheet();
    };

    const dispatch = useDispatch();

    const handleChangeAbout = async (about) => {
        try {
            await updateUserProfile({ bio: about }).unwrap();
            dispatch(updateUserDetails({ bio: about }));
        } catch (err) {
            console.log("ERROR OCCURED IN ", err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header heading={"About"} backHandler={() => navigation.goBack()} borderBottomWidth={0} />

            {/* Selected Status Display */}
            <View style={styles.currentStatusContainer}>
                <Text style={styles.currentStatusText}>Currently set to</Text>
                <View style={styles.statusRow}>
                    <Text style={styles.selectedText}>{user?.bio}</Text>
                    <TouchableOpacity onPress={openDetailBottomSheet} style={{ alignSelf: 'center', padding: 10 }}>
                        <Octicons name="pencil" size={16} color={COLORS?.PRIMARY} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.selectAboutText}>Select About</Text>

            {/* Status Selection List */}
            <FlatList
                data={aboutStatuses}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.statusItem} onPress={() => handleChangeAbout(item)}>
                        <Text style={styles.statusText}>{item}</Text>
                        {user?.bio === item && (
                            <Ionicons name="checkmark" size={25} color={COLORS.PRIMARY} />
                        )}
                    </TouchableOpacity>
                )}
            />
            <CommonBottomSheet bottomSheetRef={bottomSheetRef} closeBottomSheet={closeBottomSheet}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add About</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                ref={inputRef}
                                style={styles.modalInput}
                                value={about}
                                autoFocus={true}
                                onChangeText={(text) => text.length <= MAX_ABOUT_LENGTH && setAbout(text)}
                                placeholder=""
                                maxLength={MAX_ABOUT_LENGTH}
                                selectionColor={COLORS.PRIMARY}
                            />
                            {about?.length > 0 && <Text style={styles.charCount}>{MAX_ABOUT_LENGTH - about?.length}</Text>}
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={closeBottomSheet} >
                                <Text style={styles?.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={saveNewBio} disabled={!about?.length} >
                                <Text style={[styles?.buttonText, { color: !about?.length ? COLORS.DARK_SLATE_GRAY : COLORS.PRIMARY }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </CommonBottomSheet>
            {isLoading && <Loader />}
        </SafeAreaView>
    );
};

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    currentStatusContainer: {
        paddingVertical: 20,
        borderBottomColor: COLORS.LIGHT_GRAY,
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    currentStatusText: {
        marginVertical: 5,
        color: COLORS.DARK_SLATE_GRAY,
        fontSize: 14,
        fontWeight: "600",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingEnd: 10,
    },
    selectedText: {
        fontSize: 16,
        marginVertical: 10,
        width: "90%"
    },
    selectAboutText: {
        paddingStart: 10,
        marginVertical: 5,
        color: COLORS.DARK_SLATE_GRAY,
        fontSize: 14,
        fontWeight: "600",
    },
    statusItem: {
        padding: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statusText: {
        fontSize: 16,
    },
    // Modal Classes
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
    },
    modalInput: {
        width: "95%",
        fontSize: 18,
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomColor: COLORS.PRIMARY,
        borderBottomWidth: 2,
    },
    charCount: {
        fontSize: 14,
        color: "#888",
    },
    modalButtons: {
        flexDirection: "row",
        width: "40%",
        marginVertical: 20,
        alignSelf: "flex-end",
        justifyContent: "space-between",
    },
    buttonText: { color: COLORS.PRIMARY, fontWeight: 600, padding: 10, }
});
