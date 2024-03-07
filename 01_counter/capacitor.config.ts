import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '01_counter_standalone_app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
