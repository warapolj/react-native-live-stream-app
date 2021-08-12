import React, {useCallback, useEffect, useState} from 'react';
import {
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {io} from 'socket.io-client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useKeyBoardOffset} from './hooks';

export interface ISwipe {
  status: boolean;
  direction: SwipeDirection;
}

export type SwipeDirection = 'left' | 'right' | undefined;

const socket = io('http://54.179.206.71:5000');

const Chat = ({status, direction}: ISwipe) => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const {keyboardOffset} = useKeyBoardOffset();

  const animationIn = direction === 'left' ? 'slideInRight' : 'slideInLeft';
  const animationOut = direction === 'left' ? 'slideOutLeft' : 'slideOutRight';

  useEffect(() => {
    console.log('socket', socket);
    socket.on('chat message', message => {
      console.log('------------- receive message', message);
    });
  }, []);

  const sendMessage = useCallback(() => {
    socket.emit('chat message', message);
    console.log('----------- send message', message);
    setMessage('');
  }, [socket, message]);

  return (
    <Modal
      isVisible={status}
      animationIn={animationIn}
      animationOut={animationOut}
      animationInTiming={200}
      animationOutTiming={200}
      style={[{margin: 0}, Platform.OS === 'ios' && {marginBottom: 44}]}>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
          // backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backgroundColor: 'transparent',
        }}>
        <View style={{flex: 1}}></View>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,

              backgroundColor: '#979394',
            },
            ,
            Platform.OS === 'ios' && {
              bottom: keyboardOffset > 0 ? keyboardOffset - 44 : 0,
            },
          ]}>
          <TextInput
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            underlineColorAndroid="transparent"
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 15,
              paddingHorizontal: 10,
              padding: 10,
            }}
          />
          <TouchableOpacity
            disabled={message.length <= 0}
            onPress={sendMessage}
            style={{marginLeft: 10}}>
            <Icon name="send-circle" size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Chat;
