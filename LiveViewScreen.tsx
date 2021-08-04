import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {VLCPlayer} from 'react-native-vlc-media-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation';
import Slider from '@react-native-community/slider';

interface LiveViewScreenProps {
  url: string;
}

const LiveViewScreen: React.FC<LiveViewScreenProps> = props => {
  const {params} = useRoute();
  const vlcPlayerRef = useRef(null);

  const [isPaused, setPause] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [isShowCtrl, setShowCtrl] = useState(true);
  const [icon, setIcon] = useState();

  useEffect(() => {
    if (isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, [isFullScreen]);

  useEffect(() => {
    setTimeout(() => {
      setShowCtrl(false);
    }, 3000);

    // Icon.getImageSource('circle', 15, 'white').then(setIcon);
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      setShowCtrl(true);
    } else {
      // setTimeout(() => {
      //   setShowCtrl(false);
      // }, 3000);
    }
  }, [isPaused]);

  const onProgress = event => {
    console.log('onProgress', event);
  };

  const onEnded = event => {
    console.log('onEnded', event);
  };

  const onPlaying = event => {
    console.log('onPlaying', event);
  };

  const onBuffering = e => {
    console.log('onBuffering', e);
  };

  const onError = event => {
    console.log('onError', event);
  };

  const onOpen = event => {
    console.log('onOpen', event);
  };

  const onLoadStart = e => {
    console.log('onLoadStart', e);
  };

  // const calcVLCPlayerHeight = (windowWidth, aspetRatio) => {
  //   return windowWidth * aspetRatio;
  // };

  const onPressOut = () => {
    if (isShowCtrl) {
      setShowCtrl(false);
    } else {
      setShowCtrl(true);
      // setTimeout(() => {
      //   setShowCtrl(false);
      // }, 3000);
    }
  };

  const Loading = useMemo(() => {
    if (isLoading && !isError) {
      return (
        <View style={{}}>
          <ActivityIndicator size={'large'} animating={true} color="#fff" />
        </View>
      );
    }

    return <></>;
  }, [isLoading, isError]);

  const Error = useMemo(() => {
    if (isError) {
      return (
        <View style={[{backgroundColor: '#000'}]}>
          <Text style={{color: 'red'}}>Error play video, please try again</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              width: 100,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            {/* <Icon name={'reload'} size={45} color="#fff" /> */}
          </TouchableOpacity>
        </View>
      );
    }

    return <></>;
  }, [isError]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{backgroundColor: '#000'}}
      onPressOut={onPressOut}>
      <VLCPlayer
        ref={vlcPlayerRef}
        paused={isPaused}
        source={{uri: `rtmp://127.0.0.1:1935/live/${params?.streamKey}`}}
        onProgress={onProgress}
        onEnd={onEnded}
        onStopped={onEnded}
        onPlaying={onPlaying}
        onBuffering={onBuffering}
        progressUpdateInterval={250}
        onError={onError}
        onOpen={onOpen}
        onLoadStart={onLoadStart}
        style={[styles.video, {height: isFullScreen ? '100%' : 220}]}
        // autoplay={true}
        // autoAspectRatio={true}
      />
      {/* {Loading} */}
      {/* {Error} */}
      {isShowCtrl && (
        <>
          <View
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <TouchableOpacity onPress={() => setPause(!isPaused)}>
              <Icon name={isPaused ? 'play' : 'pause'} size={40} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={[
              {
                position: 'absolute',
                left: 0,
                bottom: isFullScreen ? 20 : 0,
                zIndex: 0,
                width: '100%',
                height: 50,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingBottom: 15,
                paddingRight: 10,
              },
            ]}>
            <TouchableOpacity onPress={() => setFullScreen(!isFullScreen)}>
              <Icon
                name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                size={25}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: isFullScreen ? 20 : 0,
              zIndex: 0,
              width: '100%',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              backgroundColor: 'red',
              height: 3,
            }}>
            {/* <Slider
              style={{width: '100%', height: 5}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="red"
              maximumTrackTintColor="grey"
              thumbImage={icon}
              thumbTintColor={'red'}
            /> */}
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  video: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
  },
});

export default LiveViewScreen;
