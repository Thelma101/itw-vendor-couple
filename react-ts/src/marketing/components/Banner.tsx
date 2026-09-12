import React, { useState } from 'react';
import bannerImg1 from "@/marketing/features/Banner/assets/banner-img-1.png";
import bannerImg2 from "@/marketing/features/Banner/assets/banner-img-2.png";
import bannerImg3 from "@/marketing/features/Banner/assets/banner-img-3.png";
import bannerImg4 from '@/marketing/features/Banner/assets/banner-img-4.png';
import bannerBg from '@/marketing/features/Banner/assets/banner.png';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/shared/lib/api';
import { showToast } from '@/shared/components/SimpleToast';

// const bannerImages = [bannerImg1, bannerImg2, bannerImg3, bannerImg4];

const Banner: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const isEmail = (value: string) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    };
    const isPhone = (value: string) => /^[0-9]{10,15}$/.test(value);

    // Update handleInputMethod to set email or phone based on input
    const handleInputMethod = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setContact(value);
        
        if (isEmail(value)) {
            setEmail(value);
            setPhone('');
        } else if (isPhone(value)) {
            setPhone(value);
            setEmail('');
        } else {
            setEmail(value);
            setPhone('');
        }
    };

    // Password validation
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        
        if (value.length > 0 && value.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            // showToast('Password must be at least 6 characters', 'error');
        } else {
            setPasswordError('');
        }
    };

    // Helper variable for the detected contact type
    const contactType = (() => {
        if (!contact) return null;
        if (isEmail(contact)) return 'email';
        if (isPhone(contact)) return 'phone';
        return 'invalid';
    })();

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validate password length
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        setLoading(true);

        try {
            // Build payload
            const payload: { password: string; email?: string; phone?: string } = {
                password,
            };
            if (contactType === 'email' && email) {
                payload.email = email;
            } else if (contactType === 'phone' && phone) {
                payload.phone = phone;
            }

            // Unified auth — auto-detects couple vs vendor
            const data = await authApi.unifiedLogin(payload);
            const role = data?.message?.role;

            showToast('Welcome back!', 'success');
            
            // Redirect to the correct dashboard based on detected role
            setTimeout(() => {
                if (role === 'vendor') {
                    navigate('/vendor');
                } else {
                    navigate('/couple/dashboard');
                }
            }, 1000);
            
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                showToast(error.response.data.message, 'error');
            } else {
                showToast('Invalid login credentials. Please try again.', 'error');
            }
            if (import.meta.env.DEV) {
                console.error('Sign-in error:', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Banner Section - Mobile/Tablet */}
            <section className="md:hidden w-full max-w-full mx-auto mt-[2px] px-0 flex flex-col items-center relative h-[400px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bannerBg})` }}
                ></div>
                <div className="absolute inset-0 bg-[#0E292B] opacity-80"></div>
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center mt-12 px-10 pt-6">
                    <p className="text-2xl sm:text-3xl font-primary3 leading-tight text-white">
                        Wedding planning at your fingertips.
                    </p>
                    <p className="text-lg sm:text-xl font-normal mb-6 max-w-[90%] mx-auto text-white">
                        Discover vendors. Book effortlessly. Cherish forever.
                    </p>
                    <form
                        onSubmit={handleSignin}
                        method="POST"
                        className="flex flex-col gap-4 w-full max-w-lg mx-auto"
                        aria-label="Sign in form"
                    >
                        {/* Contact Input */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="signin-contact" className="sr-only">Email or Phone Number</label>
                            <input
                                id="signin-contact"
                                type="text"
                                placeholder="Email or Phone Number"
                                name="contact"
                                value={contact}
                                onChange={handleInputMethod}
                                required
                                // className="w-full h-12 border border-[#E0E0E0] px-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-white placeholder-white text-sm md:text-base"
                                aria-label="Email or Phone Number"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="signin-password" className="sr-only">Password</label>
                            <input
                                id="signin-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                className={`mt-1 w-full md:h-12 h-12 px-3 sm:px-4 pr-12 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-white placeholder-white text-sm md:text-base ${
                                    passwordError ? 'border-primary' : 'border-[#E0E0E0]'
                                }`}
                                aria-label="Password"
                            />
                            {passwordError && (
                                <span className="text-red-400 text-xs">{passwordError}</span>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full md:h-12 h-12 rounded-3xl bg-primary hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white font-semibold text-center text-base sm:text-md shadow"
                        >
                            {loading ? 'Signing In...' : 'Log In'}
                        </button>
                        
                        <p className="text-white text-sm text-center">
                            Do not have an account?{' '}
                            <span className="text-primary cursor-pointer hover:underline font-bold">Register</span>
                        </p>
                    </form>
                </div>
            </section>

            {/* Banner Section - Desktop */}
            <section className="hidden md:block relative w-full max-w-full overflow-x-clip">
                <div className="relative w-full h-[640px] lg:h-[713px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${bannerBg})` }}
                    />
                    <div className="absolute inset-0 bg-[#0E292B] opacity-80" />
                    <div className="relative z-10 flex flex-col items-center justify-start pt-16 lg:pt-20 h-full text-white text-center px-6">
                        <p className="text-4xl lg:text-6xl xl:text-7xl font-primary3 max-w-5xl leading-tight">
                            Wedding planning at your fingertips.
                        </p>
                        <p className="mt-4 sm:text-xl md:text-2xl lg:text-3xl font-normal leading-snug max-w-3xl opacity-95">
                            Discover vendors. Book effortlessly. Cherish forever.
                        </p>
                    </div>
                </div>

                <div className="relative z-20 w-full max-w-7xl mx-auto -mt-48 lg:-mt-56 px-6 lg:px-8 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                        <div className="w-full flex flex-col items-stretch text-white">
                            <form
                                onSubmit={handleSignin}
                                method="POST"
                                className="flex flex-col gap-4 sm:gap-5 w-full max-w-md"
                                aria-label="Sign in form"
                            >
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="signin-contact-desktop" className="sr-only">Email or Phone Number</label>
                                    <input
                                        id="signin-contact-desktop"
                                        type="text"
                                        placeholder="Email or Phone Number"
                                        name="contact"
                                        value={contact}
                                        onChange={handleInputMethod}
                                        required
                                        className="mt-1 w-full h-14 px-4 rounded-3xl border border-white/40 bg-white/5 focus:ring-2 focus:ring-color-focus focus:outline-none transition text-white placeholder-white text-base"
                                        aria-label="Email or Phone Number"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label htmlFor="signin-password-desktop" className="sr-only">Password</label>
                                    <input
                                        id="signin-password-desktop"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        className={`mt-1 w-full h-14 px-4 rounded-3xl border bg-white/5 focus:ring-2 focus:ring-color-focus focus:outline-none transition text-white placeholder-white text-base ${
                                            passwordError ? 'border-red-500' : 'border-white/40'
                                        }`}
                                        aria-label="Password"
                                    />
                                    {passwordError && (
                                        <span className="text-red-400 text-xs">{passwordError}</span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 rounded-3xl bg-primary hover:bg-[#0d5f59] disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white font-semibold text-center text-base shadow"
                                    aria-label="Sign in"
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>

                                <p className="text-white text-sm md:text-base text-left mt-1">
                                    Don&apos;t have an account?{' '}
                                    <Link to="/signup" className="text-[#FFE5A8] cursor-pointer hover:text-white font-bold focus:outline-none transition-colors">Sign up here</Link>
                                </p>
                            </form>
                        </div>

                        <div className="relative hidden lg:block w-full min-h-[480px] overflow-hidden rounded-sm">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,420px)] aspect-[5/4] bg-white border border-[#00838F] shadow-md z-10">
                                <img src={bannerImg1} className="w-full h-[calc(100%-24px)] object-cover mt-6 px-3" alt="Wedding moment" />
                            </div>
                            <div className="absolute top-[28%] left-0 w-[42%] aspect-[10/9] bg-white border border-[#00838F] shadow-md z-20">
                                <img src={bannerImg2} className="w-full h-[calc(100%-16px)] object-cover mt-2 px-2" alt="Couple" />
                            </div>
                            <div className="absolute top-[34%] right-0 w-[34%] aspect-[10/9] bg-white border border-[#00838F] shadow-md z-20">
                                <img src={bannerImg4} className="w-full h-[calc(100%-16px)] object-cover mt-2 px-2" alt="Celebration" />
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[48%] aspect-[10/9] bg-white border border-[#00838F] shadow-md z-30">
                                <img src={bannerImg3} className="w-full h-[calc(100%-16px)] object-cover mt-2 px-2" alt="Venue" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Banner;
