declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';
      HOST?: string;
      PORT?: string;
    }
  }
}

export {};
