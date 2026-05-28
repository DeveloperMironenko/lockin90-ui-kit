export type ToastTone = 'success' | 'audit' | 'error';

export interface ToastData {
  id: string;
  tone: ToastTone;
  message: string;
}
