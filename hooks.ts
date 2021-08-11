import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export const useKeyBoardOffset = () => {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => setKeyboardOffset(event.endCoordinates.height),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOffset(0),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return {keyboardOffset};
};

