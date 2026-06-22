// Web stub for `expo-blur`, used only by the native Storybook (react-native-web).
// The real package is an Expo native module that doesn't bundle for the browser.
// BlurView here is a plain passthrough View (strips intensity/tint) so Card/ProGate
// render in preview. On real native, consumers install expo-blur (optional peer).
import { createElement } from 'react';
import { View } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BlurView({ intensity, tint, ...rest }: any) {
  return createElement(View, rest);
}

export default { BlurView };
