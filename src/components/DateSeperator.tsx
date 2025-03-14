import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../constants";

const DateSeparator = ({ date }) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const messageDate = new Date(date);
    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    let displayDate;
    if (isToday) {
        displayDate = "Today";
    } else if (isYesterday) {
        displayDate = "Yesterday";
    } else {
        displayDate = messageDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    return (
        <View style={styles.dateSeparatorContainer}>
            <Text style={styles.dateSeparatorText}>{displayDate}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    dateSeparatorContainer: {
        alignItems: "center",
        marginVertical: 10,
    },

    dateSeparatorText: {
        fontSize: 14,
        color: COLORS.TEXT_LIGHT,
        backgroundColor: COLORS.SOFT_GRAY,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },

})

export default DateSeparator;