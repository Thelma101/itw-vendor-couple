import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FaGoogle, FaFacebookF, FaApple, FaXTwitter } from 'react-icons/fa6';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

interface SignInProps {
    onToggleSignUp?: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onToggleSignUp }) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [role, setRole] = useState<'Couple' | 'Vendor' | ''>('');
    const [showPassword, setShowPassword] = useState(false);
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');

    // Show session expired toast if redirected from 401 interceptor
    useEffect(() => {
        if (searchParams.get('expired') === '1') {
            toast.error('Session expired. Please sign in again.');
        }
    }, [searchParams]);

    const isEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
    const isPhone = (value: string) => /^[0-9]{10,15}$/.test(value);

    const contactType = (() => {
        if (!contact) return null;
        if (isEmail(contact)) return 'email';
        if (isPhone(contact)) return 'phone';
        return 'invalid';
    })();

    const loginMutation = useMutation({
        mutationFn: async () => {
            const payload: { password: string; username?: string; phone_number?: string } = {
                password,
            };

            if (contactType === 'phone') {
                payload.phone_number = contact;
            } else {
                payload.username = contact;
            }

            if (role === 'Couple') {
                return authApi.coupleLogin(payload);
            } else {
                return authApi.vendorLogin(payload);
            }
        },
        onSuccess: () => {
            toast.success('Welcome back!');
            const token = localStorage.getItem('authToken');
            const dashboardBase = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5177';
            if (role === 'Couple') {
                window.location.href = `${dashboardBase}/couple/dashboard?token=${token}&role=couple`;
            } else {
                window.location.href = `${dashboardBase}/vendor/overview?token=${token}&role=vendor`;
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!role) {
            toast.error('Please select your role to continue');
            return;
        }

        if (!contact || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (contactType === 'invalid') {
            toast.error('Please enter a valid email or phone number');
            return;
        }

        loginMutation.mutate();
    }

    const handleToggleSignUp = () => {
        if (onToggleSignUp) {
            onToggleSignUp();
        } else {
            navigate('/signup');
        }
    }

    return (
        <section className="w-full flex items-center justify-center py-2">
            <div className="px-4 py-2 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-1 text-center text-primary-dark">{role ? `${role} Log in` : 'Log in'}</h2>
                <p className="text-center text-primary-dark font-thin text-sm mb-3">Good to see you again! Let's make more {' '}
                    <span className="text-primary-red">magic.</span>
                </p>
                <p className="text-center text-xs text-gray-400 mb-2">I am a...</p>
                <div className="flex justify-center gap-3 mb-3">
                    <button
                        type="button"
                        onClick={() => setRole('Couple')}
                        className={`flex-1 max-w-[140px] flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            role === 'Couple'
                                ? 'border-[#00838F] bg-[#00838F]/5 shadow-md scale-[1.02]'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-2xl">💍</span>
                        <span className={`text-sm font-semibold ${role === 'Couple' ? 'text-[#00838F]' : 'text-gray-500'}`}>Couple</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('Vendor')}
                        className={`flex-1 max-w-[140px] flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            role === 'Vendor'
                                ? 'border-[#00838F] bg-[#00838F]/5 shadow-md scale-[1.02]'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-2xl">🏪</span>
                        <span className={`text-sm font-semibold ${role === 'Vendor' ? 'text-[#00838F]' : 'text-gray-500'}`}>Vendor</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="px-5 md:px-0 font-thin">
                    <label className="block mb-3">
                        <span className="text-primary-black text-xs sm:text-sm">Email or Phone Number</span>
                        <input
                            type="text"
                            placeholder="Email or Phone Number"
                            name="contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base" />
                        {contact && (
                            <div className="mt-1 text-xs">
                                {contactType === 'email' && (
                                    <span className="text-green-600 flex items-center gap-1">
                                        ✓ Email detected
                                    </span>
                                )}
                                {contactType === 'phone' && (
                                    <span className="text-blue-600 flex items-center gap-1">
                                        ✓ Phone detected
                                    </span>
                                )}
                                {contactType === 'invalid' && (
                                    <span className="text-red-600 flex items-center gap-1">
                                        Please enter a valid email or phone number
                                    </span>
                                )}
                            </div>
                        )}
                    </label>
                    <label className="block mb-3">
                        <span className="text-primary-dark text-xs sm:text-sm">Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 pr-12 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </label>
                    <div className="flex justify-end px-1 mb-1">
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-xs text-[#00838F] hover:underline font-medium"
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <button 
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full md:h-12 h-12 rounded-3xl bg-[#00838F] hover:bg-[#006d75] disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white font-semibold text-center text-base sm:text-md shadow mt-3"
                    >
                        {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                            <h3 className="text-lg font-semibold text-primary-dark mb-2">Reset Password</h3>
                            <p className="text-sm text-gray-500 mb-4">Enter your email or phone number and we'll send you a reset code.</p>
                            <input
                                type="text"
                                placeholder="Email or Phone Number"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full h-12 px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm"
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => { setShowForgotPassword(false); setResetEmail(''); }}
                                    className="flex-1 h-10 rounded-3xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (!resetEmail) { toast.error('Please enter your email or phone'); return; }
                                        toast.success('Reset code sent! Check your email/phone.');
                                        setShowForgotPassword(false);
                                        setResetEmail('');
                                    }}
                                    className="flex-1 h-10 rounded-3xl bg-[#00838F] text-white text-sm font-medium hover:bg-[#006d75] transition"
                                >
                                    Send Code
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-200" />
                    <span className="mx-4 text-gray-400 text-xs">or continue with</span>
                    <div className="flex-grow h-px bg-gray-200" />
                </div>
                <div className="flex justify-center gap-3 mb-4 px-5 md:px-0">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign in with Google"><FaGoogle className="text-[#EA4335] text-lg" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign in with Facebook"><FaFacebookF className="text-[#1877F3] text-lg" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign in with Apple"><FaApple className="text-black text-lg" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign in with X"><FaXTwitter className="text-black text-lg" /></button>
                </div>
                <div className="flex justify-center font-thin px-5 md:px-0 mt-2 text-xs sm:text-sm text-primary-dark">
                    <span>Don't have an account yet? </span>
                    <button
                        onClick={handleToggleSignUp}
                        className="text-[#00838F] font-semibold hover:underline ml-1"
                    >
                        Register Now
                    </button>
                </div>
            </div>
        </section>
    );
}

export default SignIn;

