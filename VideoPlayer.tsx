import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
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

const {width, height} = Dimensions.get('window');

const VideoPlayer = () => {
  const navigation = useNavigation();
  const player = useRef(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isShowCtrl, setIsShowCtrl] = useState(true);

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
    if (data.isBuffering) {
      setIsLoading(true);
    }
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
    Alert.alert('This live is finished.', '', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const onError = (error: LoadError) => {
    console.log('onError', error);
    if (
      error.error?.code === -1100 ||
      error.error?.domain === 'NSURLErrorDomain'
    ) {
      Alert.alert('This live is finished.', '', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        height: isFullScreen ? '100%' : '30%',
        width: '100%',
        backgroundColor: 'grey',
      }}>
      <Video
        ref={player}
        source={{
          uri: 'https://4144f7c510c7.us-east-1.playback.live-video.net/api/video/v1/us-east-1.302125021807.channel.R6hCSBhdIYmy.m3u8',
        }}
        rate={1}
        volume={1}
        muted={muted}
        paused={paused}
        resizeMode="contain"
        progressUpdateInterval={1000}
        fullscreen={isFullScreen}
        // onLoad={onLoad}
        onBuffer={onBuffer}
        onReadyForDisplay={onReadyForDisplay}
        // onProgress={onProgress}
        onBandwidthUpdate={onBandwidthUpdate}
        onEnd={onEnd}
        onError={onError}
        style={[
          {
            position: 'absolute',
            aspectRatio: width / height,
            backgroundColor: '#000',
            height: '100%',
            width: '100%',
          },
          isShowCtrl && {opacity: 0.5},
        ]}
      />
      {isShowCtrl && (
        <>
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'red',
              borderRadius: 5,
              marginTop: 15,
              marginLeft: 15,
            }}>
            <Text style={{padding: 5, color: '#fff', fontWeight: 'bold'}}>
              Live
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" animating={true} />
            ) : (
              <TouchableOpacity
                onPress={() => setPaused(!paused)}
                style={{marginRight: 10}}>
                <Icon
                  name={paused ? 'play-circle-outline' : 'pause-circle-outline'}
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              position: 'absolute',
              width: isFullScreen ? '90%' : '100%',
              height: '100%',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              alignSelf: 'center',
              paddingBottom: 20,
              paddingRight: 20,
              flexDirection: 'row',
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
        </>
      )}
    </View>
  );
};

export default VideoPlayer;
