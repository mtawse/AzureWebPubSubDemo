import { ListIcon, ListItem } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const MessageItem = ({ message }) => (
  <ListItem>
    <ListIcon as={CheckCircleIcon} color="green.500" />
    {message}
  </ListItem>
);

export default MessageItem;
