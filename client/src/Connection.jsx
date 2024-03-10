import { Button, HStack } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const Connection = ({ connected, connectionError, onClick }) => (
  <HStack>
    <Button
      _hover={{
        bg: 'green.500',
      }}
      bg="green.400"
      colorScheme="green"
      isDisabled={connected}
      onClick={onClick}
      px={6}
    >
      Connect
    </Button>
    {connected ? <CheckCircleIcon boxSize={6} color="green.400" /> : null}
    {connectionError ? <WarningIcon boxSize={6} color="red.400" /> : null}
  </HStack>
);

export default Connection;
