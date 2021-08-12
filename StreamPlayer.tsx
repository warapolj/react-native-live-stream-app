import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Platform,
  SafeAreaView,
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
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';
import ChatModal, {ISwipe, SwipeDirection} from './Chat';

const VideoPlayer = () => {
  const navigation = useNavigation();
  const playerRef = useRef(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isShowCtrl, setIsShowCtrl] = useState(true);
  const [swipe, setSwipe] = useState<ISwipe>({
    status: false,
    direction: undefined,
  });

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

  const onEnd = () => {
    // Alert.alert('This live is finished.', '', [
    //   {
    //     text: 'OK',
    //     onPress: () => navigation.goBack(),
    //   },
    // ]);
  };

  const onError = (error: LoadError) => {
    console.log('onError', error);
    if (
      error.error?.code === -1100 ||
      error.error?.domain === 'NSURLErrorDomain'
    ) {
      // Alert.alert('This live is finished.', '', [
      //   {
      //     text: 'OK',
      //     onPress: () => navigation.goBack(),
      //   },
      // ]);
    }
  };

  const onSwipe = (direction: SwipeDirection) => {
    setSwipe({
      status: !swipe.status,
      direction,
    });
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

  const renderChatModal = useMemo(() => {
    return <ChatModal {...swipe} />;
  }, [swipe]);

  return (
    <SafeAreaView
      style={{
        // height: isFullScreen ? '100%' : '30%',
        // height: '100%',
        // width: '100%',
        flex: 1,
        backgroundColor: 'grey',
      }}>
      <GestureRecognizer
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 200,
        }}
        onSwipeLeft={() => onSwipe('left')}
        onSwipeRight={() => onSwipe('right')}
        style={{flex: 1}}>
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
          onEnd={onEnd}
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
        <>
          {isShowCtrl && (
            <>
              {renderCtrlIsLive}
              {renderLoading}
              {/* {renderCtrlPlayPause} */}
              {/* {renderCtrlBottom} */}
            </>
          )}
          {renderChatModal}
        </>
      </GestureRecognizer>
    </SafeAreaView>
  );
};

export default VideoPlayer;
