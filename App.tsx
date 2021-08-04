import React from 'react';
import {Button, SafeAreaView} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FlatList} from 'react-native-gesture-handler';
import LiveViewScreen from './LiveViewScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LiveView" component={LiveViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();

  const lives = [
    'stream001',
    'stream002',
    'stream003',
    'stream004',
  ];

  return (
    <SafeAreaView>
      <FlatList
        data={lives}
        keyExtractor={item => item}
        renderItem={({item}) => {
          return (
            <Button
              title={`View Live: ${item}`}
              onPress={() =>
                navigation.navigate('LiveView', {streamKey: item})
              }
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default App;
