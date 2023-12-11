declare global {
  namespace NodeJS {
    interface ProcessEnv {
      __DEV__: string;
      __FIREFOX__: string;
      CI: string;
    }
  }
}

export {};
