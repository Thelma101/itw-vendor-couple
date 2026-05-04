import React from 'react';

const OnboardingGallery: React.FC = () => {
    const images = [
        { id: 1, name: 'Venue', image: 'https://res.cloudinary.com/dfp5thr3y/image/upload/v1750539059/venue_ptzzou.svg' },
        { id: 2, name: 'MakeUp & Hair', image: 'https://res.cloudinary.com/dfp5thr3y/image/upload/v1750539050/makeup_f5sima.svg' },
        { id: 3, name: 'Cakes & Desserts', image: 'https://res.cloudinary.com/dfp5thr3y/image/upload/v1750539053/cakes_kfodsw.svg' },
        { id: 4, name: 'Interior Decoration', image: 'https://res.cloudinary.com/dfp5thr3y/image/upload/v1750539054/dj_unlrdy.svg' },
        { id: 5, name: 'Cars', image: 'https://res.cloudinary.com/dfp5thr3y/image/upload/v1750539056/cars_wdrnq1.svg' },
    ];

    return (
        <section className='flex w-full px-5'>
            <div className='mx-auto w-full max-w-3xl'>
                <div className="grid grid-cols-3">
                    {images.slice(0, 3).map((image) => (
                        <div key={image.id} className="w-full p-1 md:p-2">
                            <div className='shadow-md relative overflow-hidden rounded-lg group'>
                                <img
                                    src={image.image}
                                    alt={image.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                                <span className="absolute bottom-2 left-2 text-white text-xs font-medium drop-shadow-lg">{image.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='grid grid-cols-2'>
                    {images.slice(3, 5).map((image) => (
                        <div key={image.id} className='w-full p-1 md:p-2'>
                            <div className='shadow-md relative overflow-hidden rounded-lg group'>
                                <img
                                    src={image.image}
                                    alt={image.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                                <span className="absolute bottom-2 left-2 text-white text-xs font-medium drop-shadow-lg">{image.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OnboardingGallery;

