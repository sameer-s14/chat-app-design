import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, Animated, View, StyleSheet, Text, TextInput } from "react-native";
import { COLORS } from "../constants";
import { hs } from "../utils";

function Header({ backHandler, heading = 'Profile' }) {
    return <View style={[styles.header]}>
        <View style={[styles.titleContainer]}>
            <TouchableOpacity onPress={backHandler}>
                <Ionicons name="arrow-back" size={25} color={COLORS.BLACK} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{heading}</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 5,
        borderBottomColor: COLORS.LIGHT_GRAY,
        height: hs(60),
        borderBottomWidth:1,
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
    headerTitle: {
        marginHorizontal: 10,
        fontSize: 18,
    },
    backIcon: { marginHorizontal: 10 }
});

export default Header;