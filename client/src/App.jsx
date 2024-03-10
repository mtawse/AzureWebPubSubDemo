import { useEffect, useState } from 'react';
import { Box, chakra, Container, Divider, Flex, Grid, GridItem, VStack } from '@chakra-ui/react';
import Connection from './Connection';
import MessageList from './MessageList';
import SendMessage from './SendMessage';

const App = () => {
  const SERVER_URL = 'http://localhost:3000';

  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    if (!webSocket) {
      return;
    }

    webSocket.onopen = () => setConnected(true);

    webSocket.onmessage = (event) => handleMessageEvent(event);

    webSocket.onclose = () => setConnected(false);

    webSocket.onerror = (error) => {
      console.log('Socket encountered error: ', error, 'Closing socket');
      setConnected(false);
      setConnectionError(error);
      webSocket.close();
    };

    return () => {
      webSocket.close();
    };
  }, [webSocket]);

  const handleConnect = async () => {
    setConnectionError(null);
    const randNum = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    setUserId(randNum);
    await callConnect(randNum);
  };

  const callConnect = async (id) => {
    const response = await fetch(`${SERVER_URL}/negotiate?id=${id}`);
    const token = await response.json();
    setWebSocket(new WebSocket(token.url));
  };

  const handleMessageEvent = (event) => {
    if (event.data instanceof Blob) {
      const reader = new FileReader();

      reader.onload = () => {
        const message = JSON.parse(reader.result);
        setMessages((prev) => [...prev, ...[message]]);
      };

      reader.readAsText(event.data);
    } else {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, ...[message]]);
    }
  };

  const handleSend = async (id) => {
    const messageToSend = messageInput;
    setMessageInput('');
    await fetch(`${SERVER_URL}/send?id=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageToSend }),
    });
  };

  const handleInputChange = (e) => setMessageInput(e.target.value);

  return (
    <Box as={Container} maxW="7xl" mt={14} p={4}>
      <Grid
        gap={4}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <GridItem colSpan={1}>
          <VStack alignItems="flex-start" spacing="20px">
            <chakra.h2 fontSize="3xl" fontWeight="700">
              Azure Web PubSub Demo
            </chakra.h2>
            <Connection
              connected={connected}
              connectionError={connectionError}
              onClick={() => handleConnect()}
            />
          </VStack>
        </GridItem>
        <GridItem>
          <Flex>
            <chakra.p>
              Connect and send messages through websockets using a backend server.
            </chakra.p>
          </Flex>
        </GridItem>
      </Grid>
      <Divider mb={12} mt={12} />
      <Grid
        gap={{ base: '8', sm: '12', md: '16' }}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        <GridItem>
          <SendMessage
            disableButton={!connected || !messageInput}
            disableInput={!connected}
            onClick={() => handleSend(userId)}
            onChange={handleInputChange}
            value={messageInput}
          />
        </GridItem>
        <GridItem>
          <chakra.h3 fontSize="xl" fontWeight="600">
            Received messages
          </chakra.h3>
          {messages.length ? <MessageList messages={messages} /> : null}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default App;
