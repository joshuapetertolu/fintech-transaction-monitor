export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (options: ToastOptions) => void;

class ToastController {
  private listener: ToastListener | null = null;

  _subscribe(listener: ToastListener) {
    this.listener = listener;
  }

  _unsubscribe() {
    this.listener = null;
  }

  success(message: string, duration?: number) {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number) {
    this.show({ message, type: 'error', duration });
  }

  info(message: string, duration?: number) {
    this.show({ message, type: 'info', duration });
  }

  private show(options: ToastOptions) {
    if (this.listener) {
      this.listener(options);
    } else {
      console.warn('[Toast] No provider registered. Message:', options.message);
    }
  }
}

export const toast = new ToastController();
