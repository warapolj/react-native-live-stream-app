import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {VLCPlayer} from 'react-native-vlc-media-player';

interface StreamViewerProps {
  url: string;
}

type TypeVideoAspectRatio = '4:3' | '16:9';

const StreamViewer: React.FC<StreamViewerProps> = props => {
  const vlcPlayerRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] =
    useState<TypeVideoAspectRatio>('16:9');

  const onPressOut = () => {

  };

  const onProgress = event => {
    console.log('onProgress', event);
  };

  const onEnded = event => {
    console.log('onEnded', event);
  };

  const onPlaying = event => {
    console.log('onPlaying', event);
  };

  const onBuffering = event => {
    console.log('onBuffering', event);
  };

  const onPaused = event => {
    console.log('onPaused', event);
  };

  const onError = event => {
    console.log('onError', event);
  };

  const onOpen = event => {
    console.log('onOpen', event);
  };

  const onLoadStart = event => {
    console.log('onLoadStart', event);
  };

  const reload = () => {};

  return (
    <TouchableOpacity
      style={{flex: 1, height: 250}}
      activeOpacity={1}
      onPressOut={onPressOut}>
      <VLCPlayer
        ref={vlcPlayerRef}
        paused={paused}
        source={{uri: props.url}}
        videoAspectRatio={videoAspectRatio}
        onProgress={onProgress}
        onEnd={onEnded}
        onStopped={onEnded}
        onPlaying={onPlaying}
        onBuffering={onBuffering}
        onPaused={onPaused}
        progressUpdateInterval={250}
        onError={onError}
        onOpen={onOpen}
        onLoadStart={onLoadStart}
        style={styles.video}
      />
      {isLoading && !isError && (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} animating={true} color="#fff" />
        </View>
      )}
      {isError && (
        <View style={[styles.loading, {backgroundColor: '#000'}]}>
          <Text style={{color: 'red'}}>Error play video, please try again</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={reload}
            style={{
              width: 100,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            {/* <Icon name={'reload'} size={45} color="#fff" /> */}
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  video: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StreamViewer;
