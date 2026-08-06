import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FaGoogle, FaFacebookF, FaApple, FaXTwitter } from 'react-icons/fa6';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { authApi } from '@/shared/lib/api';

interface SignUpProps {
    onToggleSignIn?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onToggleSignIn }) => {
    const navigate = useNavigate()
    const [role, setRole] = useState<'Couple' | 'Vendor' | ''>('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
    const isPhone = (value: string) => /^[0-9]{10,15}$/.test(value);

    const [contactValue, setContactValue] = useState('');

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContactValue(value);
        if (isEmail(value)) {
            setEmail(value);
        } else {
            setEmail('');
        }
    };

    const contactType = (() => {
        if (!contactValue) return null;
        if (isEmail(contactValue)) return 'email';
        if (isPhone(contactValue.replace(/[^0-9]/g, ''))) return 'phone';
        return 'invalid';
    })();

    const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
        if (!pw) return { label: '', color: '', width: '0%' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
        if (score === 2) return { label: 'Fair', color: 'bg-orange-400', width: '40%' };
        if (score === 3) return { label: 'Good', color: 'bg-yellow-400', width: '60%' };
        if (score === 4) return { label: 'Strong', color: 'bg-green-400', width: '80%' };
        return { label: 'Very Strong', color: 'bg-green-600', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(password);

    const registerMutation = useMutation({
        mutationFn: async () => {
            const payload: {
                username: string;
                phone_number: string;
                password: string;
                email?: string;
                business_name?: string;
            } = {
                username: name,
                phone_number: '',
                password,
            };

            if (contactType === 'phone') {
                payload.phone_number = contactValue.replace(/[^0-9]/g, '');
            } else if (contactType === 'email') {
                payload.phone_number = '';
                payload.email = contactValue;
            }

            if (contactType === 'email' && email) {
                payload.email = email;
            }

            if (role === 'Vendor') {
                payload.business_name = name;
            }

            if (role === 'Couple') {
                return authApi.coupleRegister(payload);
            } else {
                return authApi.vendorRegister(payload);
            }
        },
        onSuccess: () => {
            toast.success(`Thank you for joining us ${name}!`);
            if (role === 'Couple') {
                navigate('/couple/dashboard');
            } else {
                navigate('/vendor');
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Signup failed. Please try again.';
            toast.error(message);
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!role) {
            toast.error('Please select your role to continue');
            return;
        }

        if (!name || !contactValue || !password) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (contactType === 'invalid') {
            toast.error('Please enter a valid email or phone number');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        registerMutation.mutate();
    };

    const handleToggleSignIn = () => {
        if (onToggleSignIn) {
            onToggleSignIn();
        } else {
            navigate('/signin');
        }
    }

    return (
        <section className="w-full flex items-center justify-center py-2">
            <div className="px-4 py-2 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-1 text-center text-primary-dark">{role ? `${role} Sign Up` : 'Sign Up'}</h2>
                <p className="text-center text-primary-dark font-thin text-sm mb-3">Start your journey to <span className="text-primary-red">'I do.'</span> Join our wedding planning family.</p>
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
                        <span className="text-primary-dark text-xs sm:text-sm font-thin">Full Name</span>
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 pr-12 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base"
                        />
                    </label>
                    <label className="block mb-3">
                        <span className="text-primary-black text-xs sm:text-sm">Email or Phone Number</span>
                        <input
                            type="text"
                            placeholder="Email or Phone Number"
                            name="emailOrPhone"
                            value={contactValue}
                            onChange={handleContactChange}
                            required
                            className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base"
                        />
                        {contactValue && (
                            <div className="mt-1 text-xs">
                                {contactType === 'email' && <span className="text-green-600">✓ Email detected</span>}
                                {contactType === 'phone' && <span className="text-blue-600">✓ Phone detected</span>}
                                {contactType === 'invalid' && <span className="text-red-600">Please enter a valid email or phone number</span>}
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
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{ width: passwordStrength.width }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 min-w-[70px]">{passwordStrength.label}</span>
                                </div>
                                {password.length < 8 && (
                                    <p className="text-xs text-gray-400 mt-1">Min. 8 characters</p>
                                )}
                            </div>
                        )}
                    </label>
                    <button type="submit" disabled={registerMutation.isPending}
                        className="w-full md:h-12 h-12 rounded-3xl bg-[#00838F] hover:bg-[#006d75] disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white font-semibold text-center text-base sm:text-md shadow mt-3"
                    >
                        {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-200" />
                    <span className="mx-4 text-gray-400 text-xs">or sign up with</span>
                    <div className="flex-grow h-px bg-gray-200" />
                </div>
                <div className="flex justify-center gap-3 mb-4 px-5 md:px-0">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign up with Google"><FaGoogle className="text-[#EA4335] text-lg" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign up with Facebook"><FaFacebookF className="text-[#1877F3] text-lg" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign up with Apple"><FaApple className="text-black text-lg" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:bg-gray-100 transition" aria-label="Sign up with X"><FaXTwitter className="text-black text-lg" /></button>
                </div>
                <div className="flex justify-center font-thin px-5 md:px-0 mt-1 mb-4 text-xs sm:text-sm text-primary-dark">
                    <span>Already have an account? </span>
                    <button
                        onClick={handleToggleSignIn}
                        className="text-[#00838F] font-semibold hover:underline ml-1"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </section>
    )
}

export default SignUp;

