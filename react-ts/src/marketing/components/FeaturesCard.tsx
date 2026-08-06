import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturesCard: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="w-full h-full bg-[#FFFFE4]">
            <div className="mx-auto px-4 py-20 md:py-48">
                <div className="flex flex-col lg:flex-row gap-10 justify-center items-stretch text-center">

                    <div className="flex-1 p-5  rounded-xl shadow">
                        <h1 className="font-bold text-xl mb-2">Shop Wedding Essentials For <br /> Your Big Day</h1>
                        <p className="mb-4">
                            Access your favourite wedding accessories from vetted vendors near you, all in one place — no stress, just style.
                        </p>
                        <button onClick={() => navigate('/signup')} className="bg-[#EB1948] text-white px-20 font-bold text-sm py-2 rounded-3xl font-primary hover:bg-[#d41540] transition-colors cursor-pointer">Try Now</button>
                    </div>

                    <div className="flex-1 p-5 rounded-xl shadow">
                        <h1 className="font-bold text-xl mb-2">Stay Organized<br />With Smart Todos</h1>
                        <p className="mb-4">
                            From venue scouting to car hires, our smart checklist helps you crush your wedding to-dos with zero guesswork.
                        </p>
                        <button onClick={() => navigate('/signup')} className="bg-[#EB1948] text-white  px-20 font-bold text-sm py-2 rounded-3xl hover:bg-[#d41540] transition-colors cursor-pointer">Try Now</button>
                    </div>

                    <div className="flex-1 p-5 rounded-xl shadow">
                        <h1 className="font-bold text-xl mb-2">Your Personal<br />Wedding Strategy Hub</h1>
                        <p className="mb-4">
                            Experience the ultimate wedding planner app — seamlessly organize, book, and check off every one of your dream to-dos with ease and confidence.
                        </p>
                        <button onClick={() => navigate('/signup')} className="bg-[#EB1948] text-white px-20 font-bold text-sm py-2 rounded-3xl hover:bg-[#d41540] transition-colors cursor-pointer">Try Now</button>
                    </div>

                </div>
            </div>
        </section>


    )
}

export default FeaturesCard;