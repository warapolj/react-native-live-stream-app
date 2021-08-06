import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FlatList} from 'react-native-gesture-handler';
import VideoPlayerScreen from './VideoPlayer';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayerScreen}
          options={{headerShown: false, animation: 'slide_from_right'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();

  const lives = ['sk_us-east-1_aET4MwEY16fY_3fOnvHIEvLaKL9jAa8M1RsIDucuphK'];

  return (
    <SafeAreaView style={{flex: 1, paddingBottom: 50}}>
      <FlatList
        data={lives}
        keyExtractor={item => item}
        renderItem={({item}) => {
          return (
            <Button
              title={item}
              onPress={() => navigation.navigate('VideoPlayer')}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default App;
