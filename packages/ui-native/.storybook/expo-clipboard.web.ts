// Web stub for `expo-clipboard`, used only by the native Storybook (react-native-web).
// The real package pulls in the Expo native runtime, which doesn't bundle for the
// browser — here we map its surface to the browser Clipboard API so CopyButton works
// in the preview. On real native, consumers install expo-clipboard (optional peer).
export function setStringAsync(value: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard
      .writeText(value)
      .then(() => true)
      .catch(() => false);
  }
  return Promise.resolve(false);
}

export async function getStringAsync(): Promise<string> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return '';
    }
  }
  return '';
}

export default { setStringAsync, getStringAsync };
