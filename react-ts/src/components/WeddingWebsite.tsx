import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

import wedWebImg1 from "../features/WeddingWebsite/assets/websiteSlide1.svg";
import wedWebImg2 from "../features/WeddingWebsite/assets/websiteSlide2.svg";
import wedWebImg3 from "../features/WeddingWebsite/assets/websiteSlide3.svg";

const images = [wedWebImg1, wedWebImg2, wedWebImg3];

const navItems = [
    {
        couple: 'Rebecca & Mike',
        items: [
            { name: "Home", href: "#" },
            { name: "Our Story", href: "#" },
            { name: "Gallery", href: "#" },
            { name: "RSVP", href: "#" },
            { name: "Registry", href: "#" }
        ]
    },
    {
        couple: "Jenn & John",
        items: [
            { name: "Home", href: "#" },
            { name: "Timeline", href: "#" },
            { name: "Photos", href: "#" },

            { name: "RSVP", href: "#" },
            { name: "Gifts", href: "#" }
        ]
    },
    {
        couple: "Kate & David",
        items: [
            { name: "Home", href: "#" },
            { name: "About Us", href: "#" },
            { name: "Events", href: "#" },
            { name: "RSVP", href: "#" },
            { name: "Wishlist", href: "#" }
        ]
    }
]

const WeddingWebsite: React.FC = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 7000)
        return () => clearInterval(interval);
    }, []);

    const prevIndex = (index - 1 + images.length) % images.length;
    const nextIndex = (index + 1) % images.length;

    return (
        <section className="container w-full mx-auto flex justify-center items-center text-center md:mt-4 py-2 md:py-20">
            <div className="flex-col w-full px-4 mx-auto justify-center align-middle text-center items-center" >
                <div className="font-primary w-full max-w-4xl flex flex-col justify-center items-center mx-auto py-7 md:py-14 px-11 md:px-32">
                    {/* <h1 className="font-bold text-4xl text-center leading-normal md:text-5xl lg:text-6xl xl:text-7xl "> */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center text-primary-dark">
                        Create a free Website for your Wedding
                    </h1>
                    <a href="https://www.weddingwire.com/wedding-website/alex-and-ashley-wedding-website" target="_blank" rel="noopener noreferrer" className="mt-4 text-xl font-bold text-center  underline"></a>
                </div>

                    {/* Oleo Script Swash Caps */}
                    {/* Carousel Container */}
                    <div className="relative w-full max-w-[1200px] h-[403px] mx-auto flex items-center justify-center overflow-hidden">
                        {/* Left Image */}
                        <motion.div
                            key={`left-${prevIndex}`}
                            className="absolute w-[500px] h-[400px] rounded-xl z-10 overflow-hidden"
                            initial={{ scale: 0.9, x: "-120%", opacity: 0.4 }}
                            animate={{ scale: 0.9, x: "-70%", opacity: 1 }}
                            transition={{ duration: 1 }}
                            style={{
                                boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                            <img
                                src={images[prevIndex]}
                                className="w-full h-full object-cover"
                                alt={`${navItems[prevIndex].couple}'s wedding`}
                            />
                            <div className="absolute top-4 left-0 right-0 z-20">
                                <nav className="flex justify-center items-center space-x-4">
                                    {navItems[prevIndex].items.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="text-white hover:text-[var(--color-primary-red)] transition-colors text-xs font-thin"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center z-20 px-5">
                                <h3 className="text-white text-lg font-light tracking-widest">{navItems[prevIndex].couple}</h3>
                                <p className="text-white text-sm mt-1">June 15, 2024</p>
                            </div>
                        </motion.div>

                        {/* Center Image */}
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={`center-${index}`}
                                className="absolute w-[550px] h-[450px] rounded-xl z-20 overflow-hidden"
                                initial={{ scale: 0.8, opacity: 0, x: 300 }}
                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                exit={{ scale: 0.8, opacity: 0, x: -300 }}
                                transition={{ duration: 1 }}
                                style={{
                                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                <img
                                    src={images[index]}
                                    className="w-full h-full object-cover"
                                    alt={`${navItems[index].couple}'s wedding`}
                                />
                                <div className="absolute top-4 left-0 right-0 z-20">
                                    <nav className="flex justify-center items-center space-x-4 py-6">
                                        {navItems[index].items.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="text-white hover:text-[var(--color-primary-red)] transition-colors text-sm font-medium"
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 text-center z-20 py-28">
                                    <h2 className="text-white text-2xl font-light tracking-widest">{navItems[index].couple}</h2>
                                    <p className="text-white text-sm mt-2">May 10, 2025</p>
                                    <p className="text-white text-xs mt-1 opacity-80">The Grand Ballroom</p>
                                    <p className='text-white text-xs mt-1 opacity-60'>VI, Lagos  </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {/* Right Image */}
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={`right-${nextIndex}`}
                                className="absolute w-[500px] h-[400px] rounded-xl z-10 overflow-hidden"
                                initial={{ scale: 0.9, x: "120%", opacity: 0.4 }}
                                animate={{ scale: 0.9, x: "70%", opacity: 1 }}
                                transition={{ duration: 1 }}
                                style={{
                                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20' />
                                <img
                                    src={images[nextIndex]}
                                    className='w-full h-full object-cover'
                                    alt={`${navItems[nextIndex].couple}'s wedding`}
                                />
                                <div className='absolute top-4 left-0 right-0 z-20'>
                                    <nav className='flex justify-center items-center space-x-4 py-6'>
                                        {navItems[nextIndex].items.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className='text-white hover:text-[var(--color-primary-red)] transition-colors text-sm font-medium'
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
          <div className="absolute bottom-4 left-0 right-0 text-center z-20">
            <h3 className="text-white text-lg font-light tracking-widest">{navItems[nextIndex].couple}</h3>
                                    <p className='text-white text-sm mt-2'>August 20, 2025</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                    </div>

                    <div className="flex flex-col mx-auto my-12 gap-10 font-primary font-bold justify-center items-center">
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="px-14 py-4 justify-center items-center text-white font-bold leading-7 border border-primary bg-primary hover:bg-opacity-90 transition-colors cursor-pointer"
                        >
                            Check More
                        </button>
                    </div>
                </div>
        </section >

    )
}

export default WeddingWebsite;