export {};

declare global {
  interface Window {
    app: {
      quit: (url?: string) => void;
    };
  }
}
