import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    chakra,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    List,
    ListIcon,
    ListItem,
    VStack,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

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
            headers: {
                'Content-Type': 'application/json',
            },
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
                        <HStack>
                            <Button
                                _hover={{
                                    bg: 'green.500',
                                }}
                                bg="green.400"
                                colorScheme="green"
                                isDisabled={connected}
                                onClick={() => handleConnect()}
                                px={6}
                            >
                                Connect
                            </Button>
                            {connected ? <CheckCircleIcon boxSize={6} color="green.400" /> : null}
                            {connectionError ? <WarningIcon boxSize={6} color="red.400" /> : null}
                        </HStack>
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
                    <chakra.h3 fontSize="xl" fontWeight="600">
                        Send message
                    </chakra.h3>
                    <InputGroup size="md">
                        <Input
                            isDisabled={!connected}
                            onChange={handleInputChange}
                            placeholder="Enter message"
                            type="text"
                            value={messageInput}
                        />
                        <InputRightElement width="4.5rem">
                            <Button
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                bg="blue.400"
                                colorScheme="blue"
                                isDisabled={!connected || !messageInput}
                                onClick={() => handleSend(userId)}
                                px={6}
                            >
                                Send
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </GridItem>
                <GridItem>
                    <chakra.h3 fontSize="xl" fontWeight="600">
                        Received messages
                    </chakra.h3>
                    {messages.length ? (
                        <List spacing={3}>
                            {messages.map((message) => (
                                <ListItem key={message.id}>
                                    <ListIcon as={CheckCircleIcon} color="green.500" />
                                    {message.message}
                                </ListItem>
                            ))}
                        </List>
                    ) : null}
                </GridItem>
            </Grid>
        </Box>
    );
};

export default App;
