import { useState } from 'react'
import './App.css'

const App = () => {

  const SERVER_URL = 'http://localhost:3000';

  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    const randNum = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    setUserId(randNum);
    await callConnect(randNum);
  }

  const callConnect = async (id) => {
    const response = await fetch(`${SERVER_URL}/negotiate?id=${id}`);
    const token = await response.json();
    setUpSocket(token.url);
    setConnected(true)
  }

  const setUpSocket = (url) => {
    const ws = new WebSocket(url);
    ws.addEventListener('message', (e) => handleMessageEvent(e));
  }

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
  }

  const handleSend = async (id) => {
    const message = prompt("Enter your message")
    await fetch(`${SERVER_URL}/send?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
  }
  
  return (
    <>
      <h1>Azure Web PubSub Demo</h1>
      <div className="card">
        <button disabled={connected} onClick={() => handleConnect()} type="button">
          Connect
        </button>
        <button disabled={!connected} onClick={() => handleSend(userId)} type="button">
          Send
        </button>
        <div>
          <ul>
          {messages.map((message) => 
             (
              <div key={message.id}>
                Message received: {message.message}
              </div>
            )
          )}
          </ul>
        </div>
      </div>
    </>
  )
}

export default App
