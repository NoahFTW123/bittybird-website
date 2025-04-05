import React from "react";
import bannerImage from "../assets/banner.png"; // Adjust the path if needed

const Banner = () => {
    return (
        <div className="banner">
            <img src={bannerImage} alt="Banner" />
        </div>
    );
};

export default Banner;
