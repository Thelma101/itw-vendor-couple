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

export async function openPaystackCheckout(options: PaystackPopSetup) {
  await loadPaystackScript()
  if (!window.PaystackPop) throw new Error('Paystack is unavailable')
  const handler = window.PaystackPop.setup({
    currency: 'NGN',
    ...options,
  })
  handler.openIframe()
}
