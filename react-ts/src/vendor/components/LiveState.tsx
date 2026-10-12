import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white py-14 flex flex-col items-center justify-center gap-3 font-[family-name:var(--font-ui)]">
      <span className="w-7 h-7 rounded-full border-[3px] border-teal-100 border-t-[#0F766E] animate-spin" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 font-[family-name:var(--font-ui)]">
      <span>{message}</span>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="font-bold underline cursor-pointer">
          Try again
        </button>
      ) : null}
    </div>
  )
}

type EmptyAction = { label: string; to?: string; onClick?: () => void }

export function EmptyState({
  icon,
  title,
  body,
  actions = [],
}: {
  icon?: ReactNode
  title: string
  body?: string
  actions?: EmptyAction[]
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center font-[family-name:var(--font-ui)]">
      {icon ? <div className="mb-2 flex justify-center text-slate-300">{icon}</div> : null}
      <p className="font-bold text-slate-800">{title}</p>
      {body ? <p className="mt-1.5 text-sm text-slate-500 max-w-md mx-auto">{body}</p> : null}
      {actions.length ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {actions.map((a, i) =>
            a.to ? (
              <Link
                key={a.label}
                to={a.to}
                className={
                  i === 0
                    ? 'px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488]'
                    : 'px-4 py-2 rounded-xl text-sm font-bold text-[#0F766E] border border-teal-200 hover:bg-teal-50'
                }
              >
                {a.label}
              </Link>
            ) : (
              <button
                key={a.label}
                type="button"
                onClick={a.onClick}
                className={
                  i === 0
                    ? 'px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D9488] cursor-pointer'
                    : 'px-4 py-2 rounded-xl text-sm font-bold text-[#0F766E] border border-teal-200 hover:bg-teal-50 cursor-pointer'
                }
              >
                {a.label}
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  )
}
