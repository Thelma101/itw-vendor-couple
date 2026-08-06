import React from "react";

import Navbar from "@/marketing/components/Navbar";
import Banner from "@/marketing/components/Banner";
import Category from "@/marketing/components/Category";
import VendorGallery from "@/marketing/components/VendorGallery";
import FeaturesCard from "@/marketing/components/FeaturesCard";
import WeddingWebsite from "@/marketing/components/WeddingWebsite";
import Footer from "@/marketing/components/Footer";
import CalendarSection from "@/marketing/components/CalendarSection";
import WeddingHashtags from "@/marketing/components/WeddingHashtags";
import BannerMobileLayout3 from "@/marketing/components/BannerMobileLayout3";

const Homepage: React.FC = () => {
    return (
        <>
            <div className="">
                <Navbar />
                <Banner />
                <BannerMobileLayout3 />
                <Category />
                <VendorGallery />
                <FeaturesCard />
                <WeddingWebsite />
                <CalendarSection />
                <WeddingHashtags />
                <Footer />
            </div>
        </>
    )
}

export default Homepage;