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

  return (
    <div className='card'>
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className='name-field'>
          <TextField 
            name='name' 
            onChange={(evt) => onTextChange(evt)} 
            value={state.name}
            label='name'
          />
        </div>
        <div>
          <TextField
            name='message'
            onChange={(evt) => onTextChange(evt)}
            value={state.message}
            id='outlined-multiline-static'
            variant='outlined'
            label='message'
          />
        </div>
        <button>send message</button>
      </form>
      <div className='render-chat'>
        <h1>chat log</h1>
        {renderChat()}
      </div>
    </div>
  )
};