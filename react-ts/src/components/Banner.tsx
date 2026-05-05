import React, { useState } from 'react';
import bannerImg1 from "@/features/Banner/assets/banner-img-1.png";
import bannerImg2 from "@/features/Banner/assets/banner-img-2.png";
import bannerImg3 from "@/features/Banner/assets/banner-img-3.png";
import bannerImg4 from '@/features/Banner/assets/banner-img-4.png';
import bannerBg from '@/features/Banner/assets/banner.png';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/lib/api';
import { showToast } from './SimpleToast';

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
                    navigate('/vendor/dashboard');
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
                                className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base"
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
                                className={`className="mt-1 w-full md:h-12 h-12 px-3 sm:px-4 pr-12 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base ${
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
            <section className="hidden md:block relative w-full h-[713px] max-w-full mx-auto mt-[2px] px-4 sm:px-6 lg:px-8">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bannerBg})` }}
                ></div>
                <div className="absolute inset-0 bg-[#0E292B] opacity-80"></div>
                <div className="relative z-10 flex items-start justify-center pt-20 h-full text-white text-center px-2 lg:pb-40">
                    <p className="text-2xl xs:text:3xl sm:text-3xl md:text-5xl lg:text-7xl font-primary3 max-w-[90vw]">
                        Wedding planning at your fingertips.
                    </p>
                </div>
                <div className="absolute bottom-0 inset-x-0 flex items-start justify-center pt-48 w-full h-full text-white text-center">
                    <p className="sm:text-xl md:text-2xl lg:text-4xl font-normal leading-[1.3] md:leading-[50px] max-w-[90%] md:max-w-[80%]">
                        Discover vendors. Book effortlessly. Cherish forever.
                    </p>
                </div>
            </section>

            <section className="hidden md:flex flex-col md:flex-row w-full max-w-full absolute z-10 top-80 text-white px-4 sm:px-6 lg:px-8 py-6 sm:py-10 left-1/2 transform -translate-x-1/2">
                {/* Form Section */}
                <div className="w-full flex flex-col md:flex-row px-4 md:px-12 py-12 relative overflow-hidden">
                    {/* Left Form */}
                    <div className="w-full flex flex-col items-center justify-start text-xl z-10">
                        <form 
                            onSubmit={handleSignin}
                            method="POST"
                            className="flex flex-col gap-4 sm:gap-6 w-full max-w-lg py-11 md:pr-14"
                            aria-label="Sign in form"
                        >
                            {/* Contact Input */}
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
                                    // className="w-full h-12 md:h-[50px] border border-[#E0E0E0] px-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                     className="mt-1 w-full md:h-14 h-12 px-3 sm:px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base"
                                    aria-label="Email or Phone Number"
                                />
                            </div>

                            {/* Password Input */}
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
                                    className={`mt-1 w-full md:h-14 h-12 px-3 sm:px-4 rounded-3xl border border-color-focus focus:ring-2 focus:ring-color-focus focus:outline-none transition text-primary-dark text-sm md:text-base ${
                                        passwordError ? 'border-red-500' : 'border-[#E0E0E0]'
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
                                // className="w-full h-12 md:h-[50px] bg-primary text-white font-bold rounded shadow transition-transform duration-150 ease-in-out transform hover:scale-105 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4081] mt-2 mb-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                className="w-full md:h-14 h-12 rounded-3xl bg-primary hover:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white font-semibold text-center text-base sm:text-md shadow mt-1"
                                aria-label="Sign in"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                            
                            <p className="text-white text-sm md:text-base text-center md:text-left ml-2 mt-2">
                                Don&apos;t have an account?{' '}
                                {/* <Link to={registerPath} className="text-primary cursor-pointer hover:underline font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Register
                                </Link> */}
                                <Link to="/register" className="text-primary cursor-pointer hover:underline font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Register</Link>
                            </p>
                        </form>
                    </div>
                    {/* BANNER IMAGES - Desktop Only */}
                    <div className="hidden md:flex w-full min-h-[800px] relative items-center justify-center">
                        {/* Top */}
                        <div className="absolute top-[-28px] left-[56%] -translate-x-1/2 w-[520px] h-[414px] bg-white border border-[#00838F] shadow-md z-10">
                            <img src={bannerImg1} className="w-full h-[calc(100%-30px)] mx-auto object-cover mt-[27px] px-4" alt="Top" />
                        </div>
                        {/* Left */}
                        <div className="absolute top-[130px] left-[calc(33%-260px)] w-[327px] h-[292px] bg-white border border-[#00838F] shadow-md z-20">
                            <img src={bannerImg2} className="w-full h-[calc(100%-20px)] object-cover mx-auto pb-[40px] mt-3 px-3" alt="Left" />
                        </div>
                        {/* Right */}
                        <div className="absolute top-[180px] left-[calc(30%+200px)] w-[263px] h-[234px] bg-white border border-[#00838F] shadow-md z-20">
                            <img src={bannerImg4} className="w-full h-[calc(100%-20px)] object-cover mx-auto pb-[40px] mt-3 px-3" alt="Right" />
                        </div>
                        {/* Bottom */}
                        <div className="absolute top-[260px] left-[50%] -translate-x-1/2 w-[327px] h-[292px] bg-white border border-[#00838F] shadow-md z-30">
                            <img src={bannerImg3} className="w-full h-[calc(100%-20px)] object-cover mx-auto pb-[40px] mt-3 px-3" alt="Bottom" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Banner;
