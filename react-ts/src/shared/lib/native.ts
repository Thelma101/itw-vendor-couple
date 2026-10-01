import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'

/** Soften native chrome when running inside the Capacitor shell. */
export async function initNativeShell() {
  if (!Capacitor.isNativePlatform()) return

  try {
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#00838F' })
  } catch {
    // Status bar plugin may be unavailable on some emulators
  }

  try {
    await SplashScreen.hide()
  } catch {
    // Splash already dismissed
  }
}
