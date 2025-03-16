
export const groupMessagesByDate = (messages) => {
  const groupedMessages = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return Object.entries(groupedMessages).map(([date, data]) => ({
    title: date,
    data,
  }));
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

export const getCopiedText = (messages) => {
  if (messages?.length === 1) {
    return messages[0]?.message || ''
  }
  let str = ``;

  messages?.forEach((message, index) => {
    let temp = ''
    if (!messages[index - 1] || messages[index - 1]?.sender?.name !== message?.sender?.name) {
      temp = `\n ${message?.sender?.name || ''} :`
    }
    str += temp + '\n' + message?.message || '' + '\n'
  })
  return str
}