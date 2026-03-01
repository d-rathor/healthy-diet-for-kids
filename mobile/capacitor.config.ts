import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthydietforkids.app',
  appName: 'Healthy Diet For Kids',
  webDir: 'out',
  server: {
    cleartext: true,
    androidScheme: 'http'
  },
  plugins: {
    CapacitorHttp: {
      enabled: false
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "336976706017-detaqsrukk09i8606neautv3igojthb3.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
