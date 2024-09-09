import React, { useState, useEffect } from 'react';
import socket from '../socket';

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Ensure no duplicate messages are being pushed to state
    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => {
        // Check if the last message is the same to avoid duplication
        if (prevMessages.length === 0 || prevMessages[prevMessages.length - 1].message !== data.message) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });
    });
  
    return () => {
      socket.off('receiveMessage');
    };
  }, []);
  

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { username, message });
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h3 className="text-xl font-semibold mb-4 text-center">Chat Room</h3>
      <div className="chat-window bg-gray-100 p-4 rounded-md h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 my-2 bg-gray-200 rounded-md">
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
