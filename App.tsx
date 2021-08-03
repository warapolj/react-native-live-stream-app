import React from 'react';
import {SafeAreaView} from 'react-native';
import StreamViewer from './StreamViewer'

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StreamViewer url="rtmp://localhost:1935/live/stream002" />
    </SafeAreaView>
  );
};

export default App;
