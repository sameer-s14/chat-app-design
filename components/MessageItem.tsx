import Avatar from "@/src/components/Avatar";
import { COLORS } from "@/src/constants";
import { Text, View, StyleSheet, Image } from "react-native";

const MessageItem = ({ item, loggedUserId, isLastInSequence }) => {
    const isSender = item?.sender?._id === loggedUserId;

    if (item.type === "event") {
        return <Text style={styles.eventText}>{item?.message}</Text>;
    }

    if (item?.type === "file" && item?.files?.length > 0) {
        const files = item.files;
        const remainingCount = files.length - 1;

        return (
            <View
                style={[
                    styles.messageRow,
                    isSender ? styles.rightMessageRow : styles.leftMessageRow,
                ]}
            >
                {!isSender && (
                    <Avatar imageUrl={item?.sender?.profile} size={30} iconSize={30} />
                )}
                <View style={isSender ? styles.myMessage : styles.otherMessage}>
                    <View style={styles.imageGrid}>
                        {files.slice(0, 1).map((file) => (
                            <View key={file?._id} style={styles.imageContainer}>
                                <Image source={{ uri: file?.url }} style={styles.image} />
                                {remainingCount > 0 && (
                                    <View style={styles.remainingCountContainer}>
                                        <Text style={styles.remainingCountText}>+{remainingCount}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                    <Text
                        style={[
                            styles.messageText,
                            isSender ? { color: COLORS.WHITE } : { color: COLORS.TEXT_DARK },
                        ]}
                    >
                        {item?.message}
                    </Text>
                    {isLastInSequence && (
                        <Text style={styles.messageTime}>
                            {new Date(item.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.messageRow,
                isSender ? styles.rightMessageRow : styles.leftMessageRow,
            ]}
        >
            {!isSender && (
                <Avatar imageUrl={item?.sender?.profile} size={30} iconSize={30} />
            )}
            <View style={isSender ? styles.myMessage : styles.otherMessage}>
                <Text
                    style={[
                        styles.messageText,
                        isSender ? { color: COLORS.WHITE } : { color: COLORS.TEXT_DARK },
                    ]}
                >
                    {item?.message}
                </Text>
                {isLastInSequence && (
                    <Text style={styles.messageTime}>
                        {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                )}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 5,
    },
    imageContainer: {
        position: "relative",
        margin: 2,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 5,
    },
    rightMessageRow: {
        justifyContent: "flex-end",
    },
    leftMessageRow: {
        justifyContent: "flex-start",
    },
    myMessage: {
        backgroundColor: COLORS.PRIMARY,
        padding: 10,
        borderRadius: 15,
        maxWidth: "80%",
        marginLeft: "auto",
    },
    otherMessage: {
        backgroundColor: COLORS.WHITE,
        padding: 10,
        borderRadius: 15,
        maxWidth: "80%",
        marginRight: "auto",
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: COLORS.TEXT_LIGHT,
        marginTop: 5,
        alignSelf: "flex-end",
    },
    eventText: {
        textAlign: "center",
        color: COLORS.TEXT_LIGHT,
        fontSize: 12,
        marginVertical: 10,
    },
    remainingCountContainer: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: 10,
        padding: 5,
    },
    remainingCountText: {
        color: COLORS.WHITE,
        fontSize: 12,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
})
export default MessageItem;