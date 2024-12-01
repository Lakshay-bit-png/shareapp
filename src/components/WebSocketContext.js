// WebSocketContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create WebSocket Context
const WebSocketContext = createContext();

// Create a provider to hold WebSocket data
export const WebSocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let socket;
    // WebSocket connection
    socket = new WebSocket(`ws://${process.env.WS_SOCKET || "localhost:3001"}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        // Add new message to the state (this will trigger re-render)
        setMessages((prevMessages) =>  data);
      }
      else{
        setTimeout(() => {
          setMessages(null)
        }, 2000);
        
      }
      console.log(data)
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []); // Only run once when the component mounts

  return (
    <WebSocketContext.Provider value={{ messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
