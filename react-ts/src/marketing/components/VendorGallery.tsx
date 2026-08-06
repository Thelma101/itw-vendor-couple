import React from 'react';
import { useNavigate } from 'react-router-dom';
import venue from '@/marketing/features/VendorCategoryGallery/assets/venue.svg';
import cakes from '@/marketing/features/VendorCategoryGallery/assets/cakes.svg';
import dj from '@/marketing/features/VendorCategoryGallery/assets/dj.svg';
import cars from '@/marketing/features/VendorCategoryGallery/assets/cars.svg';
import makeup from '@/marketing/features/VendorCategoryGallery/assets/makeup.svg';

const VendorGallery: React.FC = () => {
    const navigate = useNavigate();
    const vendors = [{
        id: 1,
        name: 'Venue',
        image: venue,
        description: 'Best Venues near you',
        rating: 4.9
    },
    {
        id: 2,
        name: 'MakeUp & Hair',
        image: makeup,
        description: 'Best Catering near you',
        rating: 4.8
    },
    {
        id: 3,
        name: 'Cakes & Desserts',
        image: cakes,
        description: 'Best Desserts near you',
        rating: 4.7
    },
    {
        id: 4,
        name: 'Interior Decoration',
        image: dj,
        description: 'Best Decoration near you',
        rating: 4.6
    },
    {
        id: 5,
        name: 'Cars',
        image: cars,
        description: 'Best destination Hotel of your choosing',
        rating: 4.5
    },
    {
        id: 6,
        name: 'Cakes & Desserts',
        image: cakes,
        description: 'Best Desserts near you',
        rating: 4.7
    },
    {
        id: 7,
        name: 'Interior Decoration',
        image: dj,
        description: 'Best Decoration near you',
        rating: 4.6
    },
    {
        id: 8,
        name: 'Cars',
        image: cars,
        description: 'Best destination Hotel of your choosing',
        rating: 4.5
    }
    ]
    return (
        <section className="container w-full mx-auto flex justify-center items-center text-center md:mt-20 py-2 md:py-20">
            <div className="flex-col w-full md:px-4 mx-auto justify-center align-middle text-center items-center" >
                <div className="font-primary w-full max-w-4xl flex flex-col justify-center items-center mx-auto py-8 md:py-0">
                    {/* <h1 className="sm:text-2xl text-3xl sm md:text-4xl lg:text-7xl leading-[1.2] md:leading-[130px] font-bold "> */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        Fast, Affordable, and
                        Reliable Vendors</h1>
                </div>
                <div className=' bg-white' >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            vendors.slice(0, 3).map((vendor) => (
                                <div key={vendor.id}
                                    className="w-full p-4 bg-white">
                                    <div className='shadow-lg shadow-[#002528]/50'>
                                        <img
                                            src={vendor.image}
                                            alt={vendor.name}
                                            className="w-full h-full object-cover shadow-lg group-hover:shadow-2xl group-hover:shadow-primary"
                                        />
                                    </div>
                                    <div className=" flex items-center justify-center bg-primary/40 relative bottom-20">
                                        <p className="text-white font-primary text-[20px] font-bold leading-[100%] text-center">
                                            {vendor.name}
                                        </p>
                                    </div>

                                    {/* <p className="text-center text-red-600 font-semibold group-hover:text-primary "> */}
                                </div>
                            ))
                        }
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                        {
                            vendors.slice(3, 5).map((vendor) => (
                                <div key={vendor.id}
                                    className='w-full p-4 bg-white'
                                >
                                    <div className='shadow-lg shadow-[#002528]/50 '>
                                        <img
                                            src={vendor.image}
                                            alt={vendor.description}
                                            className='w-full h-full object-cover shadow'
                                        />
                                    </div>
                                    <div className=" flex items-center justify-center bg-primary/40 relative bottom-20">
                                        <p className="text-white text-[20px] font-bold leading-[100%] text-center">
                                            {vendor.name}
                                        </p>
                                    </div>

                                </div>

                            ))
                        }

                    </div>
                    <button type="button" onClick={() => navigate('/signup')} className="px-14 py-4 justify-center items-center  text-white font-bold leading-7 border border-primary bg-primary hover:bg-opacity-90 transition-colors cursor-pointer">Check More</button>
                </div>
            </div>

        </section >
    )
}

export default VendorGallery;