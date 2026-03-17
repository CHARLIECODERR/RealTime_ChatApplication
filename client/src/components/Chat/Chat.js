import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client"; // Client-side socket.io library

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

// The URL where our backend server is running
const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

let socket;

// This component handles the main chat screen
const Chat = ({ location }) => {
  const [name, setName] = useState(''); // Current user's name
  const [room, setRoom] = useState(''); // Current room name
  const [users, setUsers] = useState(''); // List of users in the current room
  const [message, setMessage] = useState(''); // The message currently being typed
  const [messages, setMessages] = useState([]); // Array of all messages in the chat

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
