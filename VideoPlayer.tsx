import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import Video, {LoadError, OnBufferData} from 'react-native-video';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

const VideoPlayer = () => {
  const player = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isShowCtrl, setIsShowCtrl] = useState(false);

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

  const onBuffer = (buefferData: OnBufferData) => {
    console.log('bueffer', buefferData);
  };

  const onError = (error: LoadError) => {
    console.log('error', error);
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
        progressUpdateInterval={250}
        onBuffer={onBuffer}
        onError={onError}
        fullscreen={isFullScreen}
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
