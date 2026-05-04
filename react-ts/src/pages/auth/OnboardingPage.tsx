import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom'
import OnboardingGallery from "@/components/onboarding/OnboardingGallery";
import SignIn from "@/components/onboarding/SignIn";
import SignUp from "@/components/onboarding/SignUp";
import itheewedLogo from '@/features/Nav/assets/Itheewed_Logo.png';

const OnboardingPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    
    useEffect(() => {
        setIsSignIn(location.pathname === '/signin');
    }, [location.pathname]);
    
    const toggleToSignUp = () => {
        navigate('/signup', { replace: true });
        setIsSignIn(false);
    };
    const toggleToSignIn = () => {
        navigate('/signin', { replace: true });
        setIsSignIn(true);
    };
    
    return (
        <section className="min-h-screen flex flex-col bg-white">
            {/* Logo - Top Left */}
            <div className="absolute top-6 left-6 z-20">
                <Link to="/">
                    <img
                        src={itheewedLogo}
                        alt="I Thee Wed Logo"
                        className="w-auto h-8 md:h-10 object-contain"
                    />
                </Link>
            </div>
            
            {/* Split Screen - vertically centered */}
            <div className="flex flex-1 flex-col lg:flex-row w-full items-center justify-center pt-16 lg:pt-0">
                {/* Gallery - Left Side */}
                <div className="lg:w-1/2 w-full flex items-center justify-center p-4 lg:p-8">
                    <OnboardingGallery />
                </div>
                {/* Form - Right Side */}
                <div className="lg:w-1/2 w-full flex items-center justify-center">
                    {isSignIn ? (
                        <SignIn onToggleSignUp={toggleToSignUp} />
                    ) : (
                        <SignUp onToggleSignIn={toggleToSignIn} />
                    )}
                </div>
            </div>
        </section>
    );
}

export default OnboardingPage;
