import React from "react";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Category from "@/components/Category";
import VendorGallery from "@/components/VendorGallery";
import FeaturesCard from "@/components/FeaturesCard";
import WeddingWebsite from "@/components/WeddingWebsite";
import Footer from "@/components/Footer";
import CalendarSection from "@/components/CalendarSection";
import WeddingHashtags from "@/components/WeddingHashtags";
import BannerMobileLayout3 from "@/components/BannerMobileLayout3";

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