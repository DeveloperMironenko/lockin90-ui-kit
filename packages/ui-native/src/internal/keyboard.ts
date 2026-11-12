import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/** The software keyboard's height on Android (0 while it is hidden, and always 0 on iOS). A Sheet,
 *  Modal or Select list sits in an RN `Modal` window drawn under a translucent status bar, where Android's
 *  `adjustResize` never shrinks the window and `KeyboardAvoidingView` has no behaviour that works: the kit
 *  pads by this height itself (iOS keeps `KeyboardAvoidingView` `padding`). */
export function useAndroidKeyboardHeight(): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const show = Keyboard.addListener('keyboardDidShow', (e) => setHeight(e.endCoordinates?.height ?? 0));
    const hide = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return height;
}
