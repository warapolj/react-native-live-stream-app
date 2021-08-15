import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import Video, {
  LoadError,
  OnBandwidthUpdateData,
  OnBufferData,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Chat, {IMessageList, mockMessage} from './Chat';
import {
  connectSocket,
  disconnectSocket,
  subscribeToChat,
  sendMessage,
} from './socketio';

const VideoPlayer = () => {
  const navigation = useNavigation();
  const playerRef = useRef(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [messageList, setMessageList] = useState<IMessageList[]>(mockMessage);

  useEffect(() => {
    if (isFullScreen) {
      Orientation.lockToLandscapeLeft();
    } else {
      Orientation.lockToPortrait();
    }

    return () => {
      Orientation.lockToPortrait();
    };
  }, [isFullScreen]);

  useEffect(() => {
    const socket = connectSocket();
    if (socket?.connected) {
      subscribeToChat((err: boolean | null, data: any) => {
        if (!err && data) {
          setMessageList([...messageList, {...data}]);
        }
      });
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const onLoad = (data: OnLoadData) => {
    console.log('onLoad', data);
  };

  const onBuffer = (data: OnBufferData) => {
    setIsLoading(data.isBuffering);
  };

  const onReadyForDisplay = () => {
    setIsLoading(false);
  };

  const onProgress = (data: OnProgressData) => {
    console.log('onProgressData', data);
  };

  const onBandwidthUpdate = (data: OnBandwidthUpdateData) => {
    console.log('onBandwidthUpdate', data);
  };

  const onException = (title: string, description?: string) => {
    Alert.alert(title, description, [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const onError = (error: LoadError) => {
    console.log('onError', error);

    // Android & IOS
    if (error.error?.extra === -1004 || error.error?.code === -1100) {
      onException('This live is not found.', 'Please try again.');
    } else {
      onException('Error!!', 'Please try again.');
    }
  };

  const renderCtrlIsLive = useMemo(() => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          width: 50,
          borderRadius: 5,
          marginTop: 15,
          marginLeft: 15,
          alignItems: 'center',
        }}>
        <Text style={{padding: 5, color: '#fff', fontWeight: 'bold'}}>
          Live
        </Text>
      </View>
    );
  }, []);

  const renderCtrlPlayPause = useMemo(() => {
    return (
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          width: '100%',
          height: '100%',
        }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" animating={true} />
        ) : (
          <TouchableOpacity onPress={() => setPaused(!paused)}>
            <Icon
              name={paused ? 'play-circle-outline' : 'pause-circle-outline'}
              size={50}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [isLoading, paused]);

  const renderLoading = useMemo(() => {
    return (
      isLoading && (
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}>
          <ActivityIndicator size="large" color="#fff" animating={true} />
        </View>
      )
    );
  }, [isLoading]);

  const renderCtrlBottom = useMemo(() => {
    return (
      <View
        style={{
          position: 'relative',
          width: isFullScreen ? '95%' : '100%',
          height: 35,
          bottom: 50,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingRight: 20,
        }}>
        <TouchableOpacity
          onPress={() => setMuted(!muted)}
          style={{marginRight: 10}}>
          <Icon
            name={muted ? 'volume-off' : 'volume-high'}
            size={25}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFullScreen(!isFullScreen)}>
          <Icon
            name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
            size={25}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  }, [isFullScreen, muted]);

  const renderVideo = useMemo(() => {
    return (
      <>
        <Video
          ref={playerRef}
          source={{
            uri: 'https://4144f7c510c7.us-east-1.playback.live-video.net/api/video/v1/us-east-1.302125021807.channel.R6hCSBhdIYmy.m3u8',
          }}
          rate={1}
          volume={1}
          muted={muted}
          paused={paused}
          resizeMode="cover"
          progressUpdateInterval={1000}
          fullscreen={Platform.OS === 'android' ? isFullScreen : false}
          onLoad={onLoad}
          onBuffer={onBuffer}
          onReadyForDisplay={onReadyForDisplay}
          // onProgress={onProgress}
          onBandwidthUpdate={onBandwidthUpdate}
          onEnd={() => onException('This live is finished.')}
          onError={onError}
          style={[
            {
              flex: 1,
              // position: 'absolute',
              // aspectRatio: width / height,
              backgroundColor: '#000',
              // height: '100%',
              // width: '100%',
            },
            // isShowCtrl && {opacity: 0.5},
          ]}
        />
        {renderCtrlIsLive}
        {renderLoading}
      </>
    );
  }, [muted, paused, isFullScreen, playerRef, isLoading]);

  const renderChat = useMemo(() => {
    return <Chat messageList={messageList} sendMessage={sendMessage} />;
  }, [messageList]);

  return (
    <SafeAreaView
      style={{
        // height: isFullScreen ? '100%' : '30%',
        // height: '100%',
        // width: '100%',
        flex: 1,
        backgroundColor: 'grey',
      }}>
      {renderVideo}
      {!isLoading && renderChat}
    </SafeAreaView>
  );
};

export default VideoPlayer;
