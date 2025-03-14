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


export const isLastInSequence = (messages, index) => {
  if (index === messages?.length - 1) return true; // Last message in the group
  const currentSender = messages[index].sender._id;
  const nextSender = messages[index + 1].sender._id;
  return currentSender !== nextSender; // Next message is from a different sender
};