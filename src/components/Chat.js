import React, { useState, useEffect } from 'react';
import socket from '../socket';

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { message, username });
      setMessage('');
    }
  };

  return (
    <div className="chat w-full h-auto bg-white p-4">
      <h3 className="text-xl font-semibold mb-4">Chat</h3>
      <div className="chat-window mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message mb-2">
            <strong>{msg.username}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="w-full p-2 border rounded-md"
      />
      <button onClick={sendMessage} className="w-full mt-2 bg-blue-500 text-white p-2 rounded-md">Send</button>
    </div>
  );
};

export default Chat;
//Chat
