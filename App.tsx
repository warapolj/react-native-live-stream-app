import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {VlCPlayerView, VLCPlayer} from 'react-native-vlc-media-player';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [pause, setPause] = useState(false);

  useEffect(() => {
    console.log('set pause');
  }, [pause]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {/* <Text>Default Player View</Text> */}
          {/* <VlCPlayerView url="rtmp://localhost:1935/live/test001" /> */}
          <Text>Custom Player View</Text>
          <VLCPlayer
            source={{uri: 'rtmp://localhost:1935/live/test001'}}
            style={{flex: 1, width: '100%', height: 250}}
            videoAspectRatio="16:9"
            paused={pause}
            onProgress={() => {
              console.log('=> onProgress');
            }}
            onEnd={() => {
              console.log('=> onEnd');
            }}
            onBuffering={() => {
              console.log('=> onBuffering');
            }}
            onError={() => {
              console.log('=> onError');
            }}
            onStopped={() => {
              console.log('=> onStopped');
            }}
            onPlaying={() => {
              console.log('=> onPlaying');
            }}
            onPaused={() => {
              console.log('=> onPaused');
            }}
          />
          <TouchableOpacity
            onPress={() => setPause(!pause)}
            style={{marginTop: 10}}>
            <Text>Pause</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
