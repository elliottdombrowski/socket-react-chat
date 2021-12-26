import TextField from '@material-ui/core/TextField';
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const App = () => {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);
  const socketRef = useRef();

  useEffect(
    () => {
      socketRef.current = io.connect('http://localhost:4000');
      socketRef.current.on('message', ({ name, message }) => {
        setChat([ ...chat, { name, message } ]);
      });
      return () => socketRef.current.disconnect();
    },
    [ chat ]
  )
  const onTextChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const onMessageSubmit = (evt) => {
    const { name, message } = state;
    socketRef.current.emit('message', { name, message });
    evt.preventDefault();
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ))
  };
};