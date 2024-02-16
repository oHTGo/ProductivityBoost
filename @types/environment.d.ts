declare global {
  namespace NodeJS {
    interface ProcessEnv {
      __DEV__: string;
      __FIREFOX__: string;

      // Environment for testing
      GOOGLE_MAIL: string;
      GOOGLE_PASSWORD: string;
    }
  }
}

export {};
