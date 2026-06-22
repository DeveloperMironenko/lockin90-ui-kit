// Web stub for `expo-document-picker`, used only by the native Storybook
// (react-native-web). There is no OS file picker in the browser preview, so this
// returns a canceled result — the Dropzone renders and is inert. On real native,
// consumers install expo-document-picker (optional peer).
export async function getDocumentAsync(): Promise<{ canceled: boolean; assets: unknown[] }> {
  return { canceled: true, assets: [] };
}

export default { getDocumentAsync };
