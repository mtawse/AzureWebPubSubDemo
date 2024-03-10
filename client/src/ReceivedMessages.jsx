import { chakra } from '@chakra-ui/react';
import MessageList from './MessageList';

const ReceivedMessages = ({ messages }) => (
  <>
    <chakra.h3 fontSize="xl" fontWeight="600">
      Received messages
    </chakra.h3>
    {messages.length ? <MessageList messages={messages} /> : null}
  </>
);

export default ReceivedMessages;
