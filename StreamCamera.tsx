import React, {useRef, useState, useMemo, useEffect} from 'react';
import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {NodeCameraView} from 'react-native-nodemediaclient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Stopwatch} from 'react-native-stopwatch-timer';
import GestureRecognizer from 'react-native-swipe-gestures';
import ChatModal, {ISwipe, SwipeDirection} from './Chat';

const StreamCamera = () => {
  const camera = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [stopwatchStart, setStopwatchStart] = useState(false);
  const [stopwatchReset, setStopwatchReset] = useState(false);
  const [swipe, setSwipe] = useState<ISwipe>({
    status: false,
    direction: undefined,
  });

  useEffect(() => {
    return () => {
      camera.current?.stop();
    };
  }, []);

  const toggleLiveButton = () => {
    if (isLive) {
      camera.current?.stop();
      setIsLive(false);

      setStopwatchStart(false);
      setStopwatchReset(true);
    } else {
      camera.current?.start();
      setIsLive(true);

      setStopwatchReset(false);
      setStopwatchStart(true);
    }
  };

  const onStatus = status => {
    console.log('onStatus', status);
  };

  const onSwipe = (direction: SwipeDirection) => {
    setSwipe({
      status: !swipe.status,
      direction,
    });
  };

  const renderChatModal = useMemo(() => {
    return <ChatModal {...swipe} />;
  }, [swipe]);

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
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}>
        <TouchableOpacity style={{marginBottom: 50}} onPress={toggleLiveButton}>
          <Icon
            name={isLive ? 'pause-circle-outline' : 'play-circle-outline'}
            size={50}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    );
  }, [isLive]);

  return (
    <GestureRecognizer
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      onSwipeLeft={() => onSwipe('left')}
      onSwipeRight={() => onSwipe('right')}
      style={{flex: 1}}>
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
        onStatus={onStatus}
        dynamicRateEnable={true}
      />
      {renderCtrlLiveTime}
      {renderCtrlLiveButton}
      {renderChatModal}
    </GestureRecognizer>
  );
};

export default StreamCamera;
