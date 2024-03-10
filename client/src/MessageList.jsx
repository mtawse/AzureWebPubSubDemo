import { List } from '@chakra-ui/react';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => (
  <List spacing={3}>
    {messages.map((message) => (
      <MessageItem key={message.id} message={message.message} />
    ))}
  </List>
);

export default MessageList;
