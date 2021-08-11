import React from 'react';
import {Button, TextInput, View, ScrollView} from 'react-native';
import {useKeyBoardOffset} from './hooks';

const Chat: React.FC<{isVisible: boolean}> = ({isVisible}) => {
  if (!isVisible) return <></>;

  const {keyboardOffset} = useKeyBoardOffset();

  return (
    <ScrollView
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
      }}
      contentContainerStyle={{flex: 1}}
      scrollEnabled={false}>
      <View style={{flex: 1}}></View>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          bottom: keyboardOffset > 0 ? keyboardOffset - 34 : 0,
          backgroundColor: '#fff',
        }}>
        <TextInput
          placeholder="Type a message..."
          underlineColorAndroid="transparent"
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderRadius: 15,
            paddingHorizontal: 10,
          }}
        />
        <Button title="Send" onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

export default Chat;
