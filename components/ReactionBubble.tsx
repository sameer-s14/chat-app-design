import { COLORS } from '@/src/constants';
import { hs } from '@/src/utils';
import { View, Text, Dimensions, StyleSheet } from 'react-native';


const ReactionBubble = ({ reactions }) => {
    // Calculate reactionList and totalCounts
    const { reactionList } = Object.keys(reactions || {}).reduce((acc, curr) => {
        acc.reactionList = [...(acc.reactionList || []), curr];
        acc.totalCounts += reactions[curr]?.length || 0;
        return acc;
    }, { reactionList: [], totalCounts: 0 });

    // Limit the number of emojis displayed in the bubble
    const MAX_EMOJIS = 3;
    const limitedReactionList = reactionList.slice(0, MAX_EMOJIS);
    const hasMoreReactions = reactionList.length > MAX_EMOJIS;

    return (
        reactionList?.length > 0 && (
            <View style={styles.reactionBubble}>
                <View style={styles.emojiContainer}>
                    {limitedReactionList.map((emoji, index) => (
                        <Text key={index} style={styles.emoji}>{emoji}</Text>
                    ))}
                    {hasMoreReactions && (
                        <Text style={styles.moreReactionsText}>
                            +{reactionList.length - MAX_EMOJIS}
                        </Text>
                    )}
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    reactionBubble: {
        position: 'absolute',
        bottom: hs(-20), // Adjust this value to position the bubble properly
        right: 0, // Align to the right of the message
        backgroundColor: COLORS.WHITE,
        flexDirection: 'row',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        minWidth: 30,
        borderWidth: 1,
        borderColor: COLORS.LIGHT_GRAY,
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emojiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 16,
        marginHorizontal: 2,
    },
    moreReactionsText: {
        fontSize: 14,
        color: COLORS.DARK_SLATE_GRAY,
        marginHorizontal: 2,
    },
    totalCountsText: {
        fontSize: 14,
        color: COLORS.DARK_SLATE_GRAY,
        marginLeft: 4,
        fontWeight: '500',
    },
});

export default ReactionBubble;