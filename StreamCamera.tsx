import React, {useRef, useState, useMemo, useEffect} from 'react';
import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {NodeCameraView} from 'react-native-nodemediaclient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Stopwatch} from 'react-native-stopwatch-timer';
import {useNavigation} from '@react-navigation/native';
import Chat, {IMessageList, mockMessage} from './Chat';
import {
  connectSocket,
  disconnectSocket,
  subscribeToChat,
  sendMessage,
} from './socketio';

enum StreamStatus {
  Connecting = 2000,
  StartPublishing = 2001,
  ConnectionFailed = 2002,
  ConnectionClosed = 2004,
  PublishNetworkCongestion = 2100,
}

const StreamCamera = () => {
  const navigation = useNavigation();
  const camera = useRef(null);

  const [isLive, setIsLive] = useState(false);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);
  const [messageList, setMessageList] = useState<IMessageList[]>(mockMessage);
  const [isEnabledChat, setEnableChat] = useState(false);
  const [isShowCtrl, setShowCtrl] = useState(true);

  useEffect(() => {
    return () => {
      camera.current?.stop();
      disconnectSocket();
      navigation.goBack();
    };
  }, []);

  useEffect(() => {
    if (isLive) {
      camera.current?.start();
      setStopwatchReset(false);
      setStopwatchStart(true);
      setEnableChat(true);

      const socket = connectSocket();
      if (socket?.connected) {
        setEnableChat(true);
        subscribeToChat((err: boolean | null, data: any) => {
          if (!err && data) {
            setMessageList([...messageList, {...data}]);
          }
        });
      }
    } else {
      camera.current?.stop();
      setStopwatchReset(false);
      setStopwatchStart(true);
    }
  }, [isLive]);

  const onStatus = (status: number) => {
    console.log('onStatus => ', StreamStatus[status]);
  };

  const renderChat = useMemo(() => {
    return (
      <Chat
        messageList={messageList}
        sendMessage={sendMessage}
        onScrollX={offsetX => {
          setShowCtrl(offsetX <= 50);
        }}
      />
    );
  }, []);

  const renderStopWatchTimer = useMemo(() => {
    return (
      <View
        style={{
          marginLeft: 5,
          borderRadius: 5,
        }}>
        <Stopwatch
          start={stopwatchStart}
          reset={stopwatchReset}
          options={{
            container: {
              backgroundColor: 'grey',
              opacity: 0.7,
              padding: 5,
              borderRadius: 5,
            },
            text: {
              color: '#FFF',
              fontWeight: 'bold',
            },
          }}
        />
      </View>
    );
  }, [stopwatchStart, stopwatchReset]);

  const renderCtrlLiveTime = useMemo(() => {
    return (
      isLive && (
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            width: '100%',
            marginTop: 15,
            marginLeft: 15,
          }}>
          <View
            style={{
              backgroundColor: 'red',
              width: 50,
              borderRadius: 5,
              alignItems: 'center',
            }}>
            <Text style={{padding: 5, color: '#fff', fontWeight: 'bold'}}>
              Live
            </Text>
          </View>
          {renderStopWatchTimer}
        </View>
      )
    );
  }, [isLive]);

  const renderCtrlLiveButton = useMemo(() => {
    return (
      <View
        style={{
          position: 'absolute',
          alignItems: 'flex-end',
          width: '100%',
          height: 100,
          zIndex: 1
        }}>
        <TouchableOpacity
          style={{marginBottom: 50}}
          onPress={() => setIsLive(!isLive)}>
          <Icon
            name={isLive ? 'pause-circle-outline' : 'play-circle-outline'}
            size={50}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  }, [isLive]);

  const renderCtrl = useMemo(() => {
    if (!isShowCtrl) return <></>;

    return (
      <>
        {renderCtrlLiveTime}
        {renderCtrlLiveButton}
      </>
    );
  }, [isShowCtrl, isLive]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <NodeCameraView
        style={{flex: 1}}
        ref={camera}
        outputUrl={
          'rtmps://4144f7c510c7.global-contribute.live-video.net:443/app/sk_us-east-1_aET4MwEY16fY_3fOnvHIEvLaKL9jAa8M1RsIDucuphK'
        }
        camera={{cameraId: 1, cameraFrontMirror: true}}
        audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
        video={{
          preset: 2,
          bitrate: 400000,
          profile: 1,
          fps: 30,
          videoFrontMirror: false,
        }}
        autopreview={true}
        denoise
        onStatus={onStatus}
        dynamicRateEnable={true}
      />
      {renderCtrl}
      {isEnabledChat && renderChat}
    </SafeAreaView>
  );
};

export default StreamCamera;
