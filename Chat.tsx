import React, {useCallback, useState, useRef, useMemo} from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useKeyBoardOffset} from './hooks';

export interface IMessageList {
  message: string;
  sender: {
    avatar: string;
    name: string;
    time?: Date;
  };
}

export const mockMessage: IMessageList[] = [
  {
    message: 'It has survived not only five centuries',
    sender: {
      name: 'Roberto',
      avatar:
        'https://i.pinimg.com/236x/75/89/87/75898779184001f29b3cf38d45b23c36.jpg',
    },
  },
  {
    message: 'The point of using Lorem Ipsum is that it',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://s5.favim.com/orig/151107/anime-boy-kawaii-nagisa-profile-pic-Favim.com-3534905.jpg',
    },
  },
  {
    message: 'Contrary to popular belief',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://i.pinimg.com/originals/96/6d/d0/966dd0ee057b527ca36e2660b5e949e9.jpg',
    },
  },
  {
    message: 'On the other hand',
    sender: {
      name: 'Robot',
      avatar:
        'https://i.pinimg.com/736x/8c/d5/4e/8cd54ea4bc006181aff08e9c11b64159.jpg',
    },
  },
  {
    message: 'It has survived not only five centuries',
    sender: {
      name: 'Roberto',
      avatar:
        'https://i.pinimg.com/236x/75/89/87/75898779184001f29b3cf38d45b23c36.jpg',
    },
  },
  {
    message: 'The point of using Lorem Ipsum is that it',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://s5.favim.com/orig/151107/anime-boy-kawaii-nagisa-profile-pic-Favim.com-3534905.jpg',
    },
  },
  {
    message: 'Contrary to popular belief',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://i.pinimg.com/originals/96/6d/d0/966dd0ee057b527ca36e2660b5e949e9.jpg',
    },
  },
  {
    message: 'On the other hand',
    sender: {
      name: 'Robot',
      avatar:
        'https://i.pinimg.com/736x/8c/d5/4e/8cd54ea4bc006181aff08e9c11b64159.jpg',
    },
  },
  {
    message: 'It has survived not only five centuries',
    sender: {
      name: 'Roberto',
      avatar:
        'https://i.pinimg.com/236x/75/89/87/75898779184001f29b3cf38d45b23c36.jpg',
    },
  },
  {
    message: 'The point of using Lorem Ipsum is that',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://s5.favim.com/orig/151107/anime-boy-kawaii-nagisa-profile-pic-Favim.com-3534905.jpg',
    },
  },
  {
    message: 'Contrary to popular belief',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://i.pinimg.com/originals/96/6d/d0/966dd0ee057b527ca36e2660b5e949e9.jpg',
    },
  },
  {
    message: 'On the other hand',
    sender: {
      name: 'Robot',
      avatar:
        'https://i.pinimg.com/736x/8c/d5/4e/8cd54ea4bc006181aff08e9c11b64159.jpg',
    },
  },
  {
    message: 'It has survived not only five centuries',
    sender: {
      name: 'Roberto',
      avatar:
        'https://i.pinimg.com/236x/75/89/87/75898779184001f29b3cf38d45b23c36.jpg',
    },
  },
  {
    message: 'The point of using Lorem Ipsum is',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://s5.favim.com/orig/151107/anime-boy-kawaii-nagisa-profile-pic-Favim.com-3534905.jpg',
    },
  },
  {
    message: 'Contrary to popular belief',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://i.pinimg.com/originals/96/6d/d0/966dd0ee057b527ca36e2660b5e949e9.jpg',
    },
  },
  {
    message: 'On the other hand',
    sender: {
      name: 'Robot',
      avatar:
        'https://i.pinimg.com/736x/8c/d5/4e/8cd54ea4bc006181aff08e9c11b64159.jpg',
    },
  },
  {
    message: 'It has survived not only five centuries',
    sender: {
      name: 'Roberto',
      avatar:
        'https://i.pinimg.com/236x/75/89/87/75898779184001f29b3cf38d45b23c36.jpg',
    },
  },
  {
    message: 'The point of using Lorem Ipsum is that it',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://s5.favim.com/orig/151107/anime-boy-kawaii-nagisa-profile-pic-Favim.com-3534905.jpg',
    },
  },
  {
    message: 'Contrary to popular belief',
    sender: {
      name: 'Akihiko',
      avatar:
        'https://i.pinimg.com/originals/96/6d/d0/966dd0ee057b527ca36e2660b5e949e9.jpg',
    },
  },
  {
    message: 'On the other hand',
    sender: {
      name: 'Robot',
      avatar:
        'https://i.pinimg.com/736x/8c/d5/4e/8cd54ea4bc006181aff08e9c11b64159.jpg',
    },
  },
];

interface ChatProps {
  messageList: IMessageList[];
  sendMessage: (msg: string) => void;
}

const {width} = Dimensions.get('window');

const Chat: React.FC<ChatProps> = ({messageList, sendMessage}) => {
  const scrollListRef = useRef(null);

  const [message, setMessage] = useState('');
  const {keyboardOffset} = useKeyBoardOffset();

  const onSendMessage = useCallback(() => {
    sendMessage(message);
    setMessage('');
  }, [message]);

  const setScrollOffset = (offset: number) => {
    scrollListRef.current?.scrollToOffset({animated: true, offset});
  };

  const renderItem = ({item, index}: {item: IMessageList; index: number}) => {
    return (
      <View
        key={'message' + index}
        style={{
          marginTop: 5,
          marginBottom: 5,
          flexDirection: 'row',
          marginHorizontal: 10,
          width: '100%',
        }}>
        <Image
          source={{uri: item.sender.avatar}}
          style={{
            width: 30,
            height: 30,
            borderRadius: 50,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            marginLeft: 5,
            borderRadius: 15,
          }}>
          <Text
            style={{
              color: '#fff',
              marginVertical: 5,
              marginHorizontal: 10,
            }}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  const renderChatList = useMemo(() => {
    return (
      <View style={{flex: 1, width: width}}>
        <ScrollView>
          {messageList.map((item, index) => renderItem({item, index}))}
        </ScrollView>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor: '#D7D8D8',
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
              height: 35,
              marginRight: 10,
            }}
          />
          <TouchableOpacity
            disabled={message.length <= 0}
            onPress={onSendMessage}>
            <Icon name="send-circle" size={40} color="#10BAFA" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [keyboardOffset, messageList, message]);

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{width}} />
        {renderChatList}
      </ScrollView>
    </View>
  );
};

export default Chat;
