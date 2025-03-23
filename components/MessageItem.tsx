import React from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/src/components/Avatar";
import { COLORS, MESSAGE_TYPES } from "@/src/constants";
import ProfilePic from "@/src/components/ProfilePic";
import ReplyPreview from "@/src/components/ReplyPreview";
import ReactionBubble from "./ReactionBubble";
const MessageItem = React.memo(({ item, loggedUserId, isLastInSequence, selectedCount, onLongPress, selected, onPress, messageRefs }) => {
    const isSender = item?.sender?._id === loggedUserId;

    if (item.type === MESSAGE_TYPES.EVENT) {
        return <Text style={styles.eventText}>{item?.message}</Text>;
    }


    if (item?.type === MESSAGE_TYPES.FILE && item?.files?.length > 0) {
        const files = item.files;
        const remainingCount = files.length - 1;

        return (
            <Pressable
                onLongPress={onLongPress}
                onPress={onPress}
                // activeOpacity={1}
                style={[
                    styles.messageRow,
                    selected && {
                        backgroundColor: "rgba(0, 123, 255, 0.1)",
                    },
                    isSender ? styles.rightMessageRow : styles.leftMessageRow,
                ]}
            >
                {/* Checkbox */}
                {selectedCount > 0 ? selected ? (
                    <View
                        style={styles.checkboxContainer}
                    >
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.PRIMARY} />
                    </View>
                ) : (
                    <View
                        style={styles.checkboxPlaceholder}
                    >
                    </View>
                ) : null}
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
            </Pressable>
        );
    }
    const replyPreview = item?.messageReply;

    return (
        <Pressable
            onLongPress={onLongPress}
            onPress={onPress}
            ref={(ref) => (messageRefs.current[item._id] = ref)}
            style={[
                styles.messageRow,
                selected && {
                    backgroundColor: "rgba(0, 123, 255, 0.1)",
                },
                Object.keys(item?.reactions || {})?.length > 0 && { marginBottom: 20 },
                isSender ? styles.rightMessageRow : styles.leftMessageRow,
            ]}
        >
            {/* Checkbox */}
            {selectedCount > 0 ? selected ? (
                <View
                    style={styles.checkboxContainer}
                >
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.PRIMARY} />
                </View>
            ) : (
                <View
                    style={styles.checkboxPlaceholder}
                >
                </View>
            ) : null}

            {!isSender && (
                <ProfilePic name={item?.sender?.name} image={item?.sender?.profile} size={30} style={{ marginRight: 16 }} />
            )}
            <View style={[{ position: 'relative' }, isSender ? styles.myMessage : styles.otherMessage]}>
                {(item?.type === MESSAGE_TYPES.REPLY && replyPreview) && <ReplyPreview replyPreview={replyPreview} />}
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
                {<ReactionBubble reactions={item?.reactions} />}
            </View>
        </Pressable>
    );
});

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
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 15,
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
    checkboxContainer: {
        marginRight: 10, // Space between checkbox and message
    },
    checkboxPlaceholder: {
        width: 30,
    },
});

// const areEqual = (prevProps, nextProps) => {
//     return (
//         prevProps.item._id === nextProps.item._id &&
//         prevProps.selected === nextProps.selected &&
//         prevProps.isLastInSequence === nextProps.isLastInSequence
//     );
// };


// export default React.memo(MessageItem, areEqual);
export default MessageItem;