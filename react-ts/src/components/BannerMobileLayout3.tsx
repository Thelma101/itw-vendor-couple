import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import bannerImg1 from "@/features/Banner/assets/banner-img-1.png";
import bannerImg2 from "@/features/Banner/assets/banner-img-2.png";
import bannerImg3 from "@/features/Banner/assets/banner-img-3.png";
import bannerImg4 from '@/features/Banner/assets/banner-img-4.png';

const bannerImages = [bannerImg1, bannerImg2, bannerImg3, bannerImg4];

const BannerMobileLayout3 = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    // const { scrollYProgress } = useScroll();
    
    // const scaleX = useSpring(scrollYProgress, {
    //     stiffness: 100,
    //     damping: 30,
    //     restDelta: 0.001
    // });

    useEffect(() => {
        const timer = setInterval(() => {
            if (!isScrolling) {
                setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
            }
        }, 6000);

        return () => clearInterval(timer);
    }, [isScrolling]);

    const handleScroll = () => {
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
    };

    const scrollToImage = (index: number) => {
        setCurrentIndex(index);
        if (scrollRef.current) {
            const container = scrollRef.current;
            const imageWidth = container.scrollWidth / bannerImages.length;
            container.scrollTo({
                left: index * imageWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="md:hidden relative w-full max-w-full mx-auto overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-cyan-50 to-cyan-0">
                <motion.div 
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-20"
                    style={{
                        backgroundImage: 'conic-gradient(from 0deg, rgba(236, 72, 153, 0.1), rgba(244, 114, 182, 0.1), rgba(236, 72, 153, 0.1))'
                    }}
                />
            </div>

            {/* Header Section */}
            <div className="relative z-10 pt-14 px-4 text-center">
                <p>Plan Your Dream Wedding, Effortlessly.</p>
                <h3 className=' text-xl font-bold font-primary3'>
                      Get Started — It’s Free!
                </h3>
            </div>

            {/* Horizontal Scroll Gallery with How It Works Cards */}
            <div className="relative z-10 px-2 mt-10 mb-6">
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {[
                        {
                            image: bannerImg1,
                            step: 1,
                            title: "Create Your Account",
                            description: "Sign up in seconds and start your wedding planning journey",
                            icon: "👰‍♀️"
                        },
                        {
                            image: bannerImg2,
                            step: 2,
                            title: "Discover Vendors",
                            description: "Browse thousands of trusted vendors in your area",
                            icon: "🔍"
                        },
                        {
                            image: bannerImg3,
                            step: 3,
                            title: "Book & Plan",
                            // description: "Secure your dream vendors and plan your perfect day"
                            description: "Add guests, track invitations, handle meal choices et cetera",
                            icon: "📅"
                        },
                        {
                            image: bannerImg4,
                            step: 4,
                            title: "Celebrate Together",
                            description: "Share your special moments with family and friends",
                            icon: "💒"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="flex-shrink-0 w-72 h-80 snap-center"
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl group cursor-pointer transform transition-all duration-300 hover:scale-105">
                                <img
                                    src={item.image}
                                    alt={`Step ${item.step}`}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Much Darker Gradient Overlay for better text visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 opacity-100 group-hover:opacity-95 transition-opacity duration-300"></div>
                                
                                {/* How It Works Content Overlay */}
                                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                                    {/* Step Number */}
                                    <div className="flex justify-end">
                                        <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            {item.step}
                                        </div>
                                    </div>
                                    
                                    {/* Step Content */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-3">
                                            <span className="text-3xl">{item.icon}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm opacity-90 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Active Indicator */}
                                {index === currentIndex && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 left-3 w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
                                    >
                                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="relative z-10 px-4 mb-6">
                <div className="flex justify-center space-x-2">
                    {bannerImages.map((_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => scrollToImage(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'bg-rose-500 scale-125' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>


            {/* Floating Action Button */}
            {/* <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </motion.button>
            </motion.div> */}
        </section>
    );
};

export default BannerMobileLayout3; 