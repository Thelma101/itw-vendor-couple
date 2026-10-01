import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'co.itheewed.app',
  appName: 'iTheeWed',
  webDir: 'dist',
  server: {
    // Lets BrowserRouter + secure cookies / HTTPS APIs work in the native shell
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#00838F',
      showSpinner: false,
    },
  },
}

export default config
