import React, { useEffect, useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { apiErrorMessage, passwordApi } from '@/shared/lib/api';

const SUPPORT_WHATSAPP_URL = 'https://wa.me/2347035626626';
const SUPPORT_WHATSAPP_DISPLAY = '0703 562 6626';

const isEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
const looksLikePhone = (value: string) => /^\+?[0-9\s-]{7,}$/.test(value);

type Step = 'request' | 'unavailable' | 'reset';

interface ForgotPasswordDialogProps {
    open: boolean;
    initialEmail?: string;
    onClose: () => void;
    /** Called with the account email once the password has been changed. */
    onReset: (email: string) => void;
}

const inputClass =
    'w-full h-12 px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm disabled:bg-gray-50';

const SupportLink: React.FC = () => (
    <a
        href={SUPPORT_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#00838F] underline underline-offset-2"
    >
        WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
    </a>
);

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, initialEmail = '', onClose, onReset }) => {
    const [step, setStep] = useState<Step>('request');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    useEffect(() => {
        if (!open) return;
        setStep('request');
        setEmail(initialEmail);
        setCode('');
        setPassword('');
        setConfirm('');
        setShowPassword(false);
        setBusy(false);
        setError('');
        setNotice('');
    }, [open, initialEmail]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !busy) onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, busy, onClose]);

    if (!open) return null;

    const trimmedEmail = email.trim();
    const phoneEntered = !!trimmedEmail && !isEmail(trimmedEmail) && looksLikePhone(trimmedEmail);

    const requestCode = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (busy) return;
        if (phoneEntered) {
            setError('Password reset works with the email on your account. If you signed up with a phone number only, please contact support.');
            return;
        }
        if (!isEmail(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setBusy(true);
        try {
            const res = await passwordApi.forgot(trimmedEmail);
            if (!res.emailEnabled) {
                setStep('unavailable');
                return;
            }
            if (step === 'reset') toast.success('A new code is on its way.');
            setNotice(`If an account exists for ${trimmedEmail}, we've emailed a 6-digit code. It expires in 15 minutes.`);
            setStep('reset');
        } catch (err) {
            setError(apiErrorMessage(err, 'We could not send a reset code. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    const submitReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;
        if (!/^\d{6}$/.test(code)) {
            setError('Enter the 6-digit code from your email.');
            return;
        }
        if (password.length < 8) {
            setError('Your new password must be at least 8 characters.');
            return;
        }
        if (password !== confirm) {
            setError('The passwords do not match.');
            return;
        }
        setError('');
        setBusy(true);
        try {
            await passwordApi.reset(trimmedEmail, code, password);
            toast.success('Password updated. Sign in with your new password.');
            onReset(trimmedEmail);
            onClose();
        } catch (err) {
            setError(apiErrorMessage(err, 'We could not reset your password. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { if (!busy) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="forgot-password-title"
                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl font-thin"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="forgot-password-title" className="text-lg font-semibold text-primary-dark mb-2">
                    {step === 'reset' ? 'Choose a new password' : 'Reset password'}
                </h3>

                {step === 'request' && (
                    <form onSubmit={requestCode} noValidate>
                        <p className="text-sm text-gray-500 mb-4">
                            Enter the email on your account and we&apos;ll send you a 6-digit reset code.
                        </p>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                            disabled={busy}
                            autoFocus
                            aria-label="Account email"
                            className={inputClass}
                        />
                        {phoneEntered && !error && (
                            <p className="mt-2 text-xs text-gray-500">
                                Signed up with a phone number only? Reset by email isn&apos;t possible for that account — contact support on <SupportLink />.
                            </p>
                        )}
                        {error && (
                            <p role="alert" className="mt-2 text-xs text-red-600">
                                {error}
                                {phoneEntered && <> <SupportLink /></>}
                            </p>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={busy}
                                className="flex-1 h-10 rounded-3xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="flex-1 h-10 rounded-3xl bg-[#00838F] text-white text-sm font-medium hover:bg-[#006d75] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {busy ? 'Sending…' : 'Send code'}
                            </button>
                        </div>
                        {!phoneEntered && (
                            <p className="mt-4 text-xs text-gray-400 text-center">
                                Signed up with a phone number? Contact support on <SupportLink />.
                            </p>
                        )}
                    </form>
                )}

                {step === 'unavailable' && (
                    <div>
                        <p className="text-sm text-gray-600 mb-3">
                            Resetting your password by email isn&apos;t available yet.
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Please contact our support team on <SupportLink /> and we&apos;ll help you get back into your account.
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-10 rounded-3xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <a
                                href={SUPPORT_WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-10 rounded-3xl bg-[#00838F] text-white text-sm font-medium hover:bg-[#006d75] transition flex items-center justify-center"
                            >
                                Open WhatsApp
                            </a>
                        </div>
                    </div>
                )}

                {step === 'reset' && (
                    <form onSubmit={submitReset} noValidate>
                        {notice && <p className="text-sm text-gray-500 mb-4">{notice}</p>}
                        <label className="block mb-3">
                            <span className="text-xs text-primary-dark">6-digit code</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                placeholder="123456"
                                value={code}
                                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); if (error) setError(''); }}
                                disabled={busy}
                                autoFocus
                                className={`${inputClass} mt-1 tracking-[0.4em] text-center`}
                            />
                        </label>
                        <label className="block mb-3">
                            <span className="text-xs text-primary-dark">New password</span>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="At least 8 characters"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                                    disabled={busy}
                                    className={`${inputClass} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </label>
                        <label className="block">
                            <span className="text-xs text-primary-dark">Confirm new password</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Repeat your new password"
                                value={confirm}
                                onChange={(e) => { setConfirm(e.target.value); if (error) setError(''); }}
                                disabled={busy}
                                className={`${inputClass} mt-1`}
                            />
                        </label>
                        {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
                        <div className="flex gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => { setStep('request'); setError(''); setCode(''); }}
                                disabled={busy}
                                className="flex-1 h-10 rounded-3xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="flex-1 h-10 rounded-3xl bg-[#00838F] text-white text-sm font-medium hover:bg-[#006d75] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {busy ? 'Saving…' : 'Reset password'}
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-gray-400 text-center">
                            No code?{' '}
                            <button
                                type="button"
                                onClick={() => requestCode()}
                                disabled={busy}
                                className="text-[#00838F] font-medium hover:underline disabled:opacity-50"
                            >
                                Send a new one
                            </button>
                            {' '}or contact <SupportLink />.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordDialog;
