import messageChat from '@/marketing/features/ChatwithVendor/assets/MessageChat.svg';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <section className="container w-full mx-auto flex justify-center items-center text-center mt-10 md:mt-56 px-4 md:py-20">
                <div className="w-full flex flex-col justify-center items-center mx-auto">
                    <div className="flex ax-w-4xl ">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                            All your vendors, ideas, and inspiration — in one <span className='text-red-600'>magical place ❤</span>
                        </h1>

                    </div>
                    <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-4 mt-14">
                        {[
                            { name: 'Venue', icon: <i className="fa-solid fa-location-dot text-2xl"></i> },
                            { name: 'Florist', icon: <i className="fa-solid fa-flower text-2xl"></i> },
                            { name: 'Cake & Dessert', icon: <i className="fa-solid fa-cake-candles text-2xl"></i> },
                            { name: 'Photography', icon: <i className="fa-solid fa-camera text-2xl"></i> },
                            { name: 'Wedding Planners', icon: <i className="fa-solid fa-hand-holding-heart text-2xl"></i> },
                            { name: 'Dress & Apparel', icon: <i className="fa-solid fa-shirt text-2xl"></i> },
                            { name: 'Catering', icon: <i className="fa-solid fa-utensils text-2xl"></i> },
                            { name: 'Decor', icon: <i className="fa-solid fa-tree text-2xl"></i> },
                            { name: 'MC/DJ/Live Band', icon: <i className="fa-solid fa-guitar text-2xl"></i> },
                            { name: 'Officiants', icon: <i className="fa-solid fa-scroll text-2xl"></i> },
                            { name: 'Wedding Gifts', icon: <i className="fa-solid fa-gift text-2xl"></i> },
                            { name: 'Jewelry', icon: <i className="fa-solid fa-ring text-2xl"></i> },
                            { name: 'Makeup & Hair', icon: <i className="fa-solid fa-face-smile text-2xl"></i> },
                            { name: 'Hotels', icon: <i className="fa-solid fa-hotel text-2xl"></i> },
                            { name: 'Bar Services', icon: <i className="fa-solid fa-beer-mug-empty text-2xl"></i> },
                            { name: 'Car Rentals', icon: <i className="fa-solid fa-car text-2xl"></i> },
                            { name: 'Videography', icon: <i className="fa-solid fa-video text-2xl"></i> },
                            { name: 'Interior Decor', icon: <i className="fa-solid fa-tree text-2xl"></i> },

                        ].map((category, index) => (
                            <div key={index} className="flex flex-col justify-center items-center border-[0.5px] border-primary px-3 py-3 md:px-8 md:py:3">
                                {category.icon}
                                <p className="text-wrap font-primary font-medium">
                                    {category.name}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col mx-auto my-12  gap-10 font-open-sans font-bold justify-center items-center  ">
                        <button type="button" onClick={() => navigate('/signup')} className="px-14 py-4 justify-center items-center  text-white font-bold leading-7 border border-primary bg-primary hover:bg-opacity-90 transition-colors cursor-pointer">Check More</button>
                    </div>
                </div>
            </section>

            {/* chat with vendor - sign in */}
            <section className="container w-full mx-auto flex flex-col md:flex-row justify-center items-center gap-10 text-center px-4 sm:px-6 lg:px-8 py-6 md:py-1 font-open-sans">
                {/* Image section */}
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-primary px-4 pt-4 pb-8">
                    <img src={messageChat} alt="Chat with Vendor" className="w-full max-w-sm md:max-w-full" />
                </div>

                {/* Text section */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 md:justify-start md:items-start text-center md:text-left mt-6 md:mt-0 md:ml-8">
                    <p className='font-extralight leading-tight'>Plan Your Wedding <span className="text-red-700 ">Like a Pro.</span></p>
                    <p className="font-semibold text-2xl sm:text-lg md:text-2xl lg:text-3xl leading-tight">
                        Chat with a Vendor
                    </p>
                    {/* <p className="font-medium leading-tight mt-1">You can chat with vendors for all your wedding plans.</p>
                    <p className="font-medium leading-tight mt-1">It takes just a few clicks with the I Thee Wed App.</p> */}

                    <p className="font-normal leading-8 mt-4">
                        It’s fast, it's easy, it’s free — start a conversation with trusted vendors, all in one place.
                    </p>
                    <div className='flex flex-col pt-10'>
                        <button type="button" onClick={() => navigate('/signin')} className=" px-12 md:px-24 py-2  text-primary font-bold border border-primary hover:bg-primary hover:text-red transition-colors cursor-pointer">Sign In</button>
                    </div>
                </div>

            </section >
        </>
    );
};

export default Category;




