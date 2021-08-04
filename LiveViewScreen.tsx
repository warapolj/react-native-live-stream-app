import {useRoute} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {useMemo} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {VLCPlayer} from 'react-native-vlc-media-player';
import Icon from 'react-native-vector-icons/AntDesign'

interface LiveViewScreenProps {
  url: string;
}

type TypeVideoAspectRatio = '4:3' | '16:9';

const LiveViewScreen: React.FC<LiveViewScreenProps> = props => {
  const {params} = useRoute();
  const vlcPlayerRef = useRef(null);

  const [paused, setPaused] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] =
    useState<TypeVideoAspectRatio>('16:9');
  const bufferInterval = useRef(null);
  const [isShowCrtl, setShowCtrl] = useState(false)

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

  const onPaused = event => {
    console.log('onPaused', event);
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

  const Loading = useMemo(() => {
    if (isLoading && !isError) {
      return (
        <View style={styles.absolute}>
          <ActivityIndicator size={'large'} animating={true} color="#fff" />
        </View>
      );
    }

    return <></>;
  }, [isLoading, isError]);

  const Error = useMemo(() => {
    if (isError) {
      return (
        <View style={[styles.absolute, {backgroundColor: '#000'}]}>
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
    <TouchableOpacity activeOpacity={1} style={{backgroundColor: '#000'}}>
      <VLCPlayer
        ref={vlcPlayerRef}
        paused={paused}
        source={{uri: `rtmp://127.0.0.1:1935/live/${params?.streamKey}`}}
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
      {/* {Loading} */}
      {/* {Error} */}
      <View style={[styles.absolute, styles.pauseStyle]}>
        <Button
          title={paused ? 'Play' : 'Pause'}
          onPress={() => setPaused(!paused)}
        />
        <Icon name='playcircleo' size={30} color='#fff' />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  video: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    height: 220,
  },
  absolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
  pauseStyle: {
    justifyContent: 'flex-end'
  },
});

export default LiveViewScreen;
