export const groupMessagesByDate = (messages: any[]) => {
    const groupedMessages: Record<string, any[]> = {};

    for (const message of messages) {
        if (!groupedMessages[message.date]) {
            groupedMessages[message.date] = [];
        }
        groupedMessages[message.date].push(message);
    }

    return groupedMessages;
};

export const addMessagesToGroup = (
    groupedMessages: Record<string, any[]>,
    newMessages: any[]
) => {
    for (const message of newMessages) {
        if (!groupedMessages[message.date]) {
            groupedMessages[message.date] = [];
        }
        groupedMessages[message.date].push(message);
    }

    return groupedMessages;
};
