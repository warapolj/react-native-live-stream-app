import {useEffect, useState, useRef} from 'react';
import {Keyboard} from 'react-native';
import io from 'socket.io-client';
import {MessageContent} from './Chat';

export const useKeyBoardOffset = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => setKeyboardOffset(event.endCoordinates.height),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOffset(0),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return {keyboardOffset};
};

export const useChat = () => {
  const ref = useRef();
  const [isConnected, setConnect] = useState(false);
  const [messageList, setMessageList] = useState<MessageContent[]>([]);

  useEffect(() => {
    const socket = io('http://192.168.1.5:3000/', {reconnection: true});
    // const socket = io('http://54.179.206.71:5000/', {reconnection: true});

    socket.on('connect', () => {
      console.log('websocket connected');
      setConnect(true);
    });

    socket.on('disconnect', () => {
      console.log('websocket disconnected');
      setConnect(false);
    });

    socket.on('chat message', (data: MessageContent) => {
      console.log('new message', data)
      setMessageList(prevState => [...prevState, data]);
    });

    ref.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (data: MessageContent) => {
    console.log('send message', data)
    ref.current?.emit('chat message', {
      content: data.content,
      sender: data.sender,
    });
  };

  return {
    isConnected,
    sendMessage,
    messageList,
  };
};
