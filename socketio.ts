import {io} from 'socket.io-client';

let socket: any;

export const connectSocket = () => {
  socket = io('http://54.179.206.71:5000/', {reconnection: true});
  return socket
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('socket disconnect:', socket.connected);
  }
};

export const subscribeToChat = (cb: any) => {
  if (!socket) return cb(true, null);

  socket.on('chat message', (data: any) => {
    console.log('on message', data);
    return cb(null, data);
  });
};

export const sendMessage = (message: string) => {
  if (socket) {
    socket.emit('chat message', message);
    console.log('emit message', message);
  }
};
