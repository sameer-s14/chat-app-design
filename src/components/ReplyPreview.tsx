import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";


const ReplyPreview = ({ replyPreview, onClose }) => {
    if (!replyPreview) return null;

    return (onClose ? <View style={{
        backgroundColor: COLORS.WHITE,
        borderRadius: 10,
        padding: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
    }} >
        <View style={styles.replyPreviewContainer}>
            <View style={styles.replyPreviewContent}>
                {replyPreview?.sender?.name && <Text style={styles.replyPreviewSender}> {replyPreview?.sender?.name} </Text>}
                {replyPreview?.message && < Text style={styles.replyPreviewText} numberOfLines={1} >
                    {replyPreview?.message}
                </Text>}
            </View>
            {onClose && < TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={20} color={COLORS.GRAY} />
            </TouchableOpacity>}
        </View>
    </View>
        :
        <View style={styles.container}>
            {replyPreview?.sender?.name && (
                <Text style={styles.senderName}>{replyPreview.sender.name}</Text>
            )}
            {replyPreview?.message && (
                <Text style={styles.messageText} numberOfLines={1}>
                    {replyPreview.message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    replyPreviewContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.PALE_GRAY,
        borderRadius: 10,
        padding: 5,
        marginBottom: 5,
        borderLeftColor: COLORS.PRIMARY,
        borderLeftWidth: 3,
    },
    replyPreviewContent: {
        flex: 1,
        marginRight: 10,
    },
    replyPreviewSender: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.TEXT_DARK,
    },
    replyPreviewText: {
        fontSize: 14,
        paddingStart: 10,
        color: COLORS.TEXT_LIGHT,
    },
    container: {
        backgroundColor: COLORS.PALE_GRAY,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.PRIMARY,
    },
    senderName: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.TEXT_DARK,
        marginBottom: 5,
    },
    messageText: {
        fontSize: 14,
        color: COLORS.TEXT_LIGHT,
    },
});

export default ReplyPreview;