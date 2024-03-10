import { Button, chakra, Input, InputGroup, InputRightElement } from '@chakra-ui/react';

const SendMessage = ({ disableInput, disableButton, onChange, onCLick, value }) => (
  <>
    <chakra.h3 fontSize="xl" fontWeight="600">
      Send message
    </chakra.h3>
    <InputGroup size="md">
      <Input
        isDisabled={disableInput}
        onChange={onChange}
        placeholder="Enter message"
        type="text"
        value={value}
      />
      <InputRightElement width="4.5rem">
        <Button
          _hover={{
            bg: 'blue.500',
          }}
          bg="blue.400"
          colorScheme="blue"
          isDisabled={disableButton}
          onClick={onCLick}
          px={6}
        >
          Send
        </Button>
      </InputRightElement>
    </InputGroup>
  </>
);

export default SendMessage;
