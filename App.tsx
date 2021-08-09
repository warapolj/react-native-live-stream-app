import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StreamPlayerScreen from './StreamPlayer';
import StreamCameraScreen from './StreamCamera';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="StreamPlayer"
          component={StreamPlayerScreen}
          options={{
            headerShown: true,
            animation: 'slide_from_right',
            title: 'Stream Player',
          }}
        />
        <Stack.Screen
          name="StreamCamera"
          component={StreamCameraScreen}
          options={{
            headerShown: true,
            animation: 'slide_from_right',
            title: 'Stream Camera',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1, paddingBottom: 50}}>
      <Button
        title={'Stream Player'}
        onPress={() => navigation.navigate('StreamPlayer')}
      />
      <Button
        title={'Stream Camera'}
        onPress={() => navigation.navigate('StreamCamera')}
      />
    </SafeAreaView>
  );
};

export default App;
