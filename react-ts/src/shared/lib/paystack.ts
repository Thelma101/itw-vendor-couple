/** Load Paystack Inline JS once. */
export function loadPaystackScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if ((window as Window & { PaystackPop?: unknown }).PaystackPop) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-paystack]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Paystack script failed')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.dataset.paystack = '1'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Paystack script failed to load'))
    document.body.appendChild(script)
  })
}

type PaystackPopSetup = {
  key: string
  email: string
  amount: number
  ref: string
  currency?: string
  callback: (response: { reference: string }) => void
  onClose?: () => void
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackPopSetup) => { openIframe: () => void }
    }
  }
}

export function getPaystackPublicKey(serverKey?: string): string {
  return (
    serverKey ||
    (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ||
    ''
  )
}

export function payerEmailFallback(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}') as { email?: string }
    if (user.email) return user.email
  } catch {
    /* ignore */
  }
  return 'vendor@itheewed.demo'
}

/**
 * Opens Paystack inline checkout. Prefer redirect URL when popup blockers interfere.
 */
export async function openPaystackCheckout(
  options: PaystackPopSetup & { authorizationUrl?: string },
): Promise<void> {
  if (!options.key) {
    throw new Error('Paystack public key missing — set VITE_PAYSTACK_PUBLIC_KEY')
  }

  try {
    await loadPaystackScript()
    if (!window.PaystackPop) throw new Error('PaystackPop unavailable')
    const handler = window.PaystackPop.setup({
      currency: 'NGN',
      key: options.key,
      email: options.email,
      amount: options.amount,
      ref: options.ref,
      callback: options.callback,
      onClose: options.onClose,
    })
    handler.openIframe()
  } catch (err) {
    if (options.authorizationUrl) {
      window.location.assign(options.authorizationUrl)
      return
    }
    throw err
  }
}
