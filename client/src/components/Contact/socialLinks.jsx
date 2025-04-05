import React, { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const SocialLinks = () => {
    return ( 
        <div className="SocialLinks">
            <a href="https://facebook.com/bittybirdandco" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} className="Facebook" />
            </a>
            <a href="https://www.instagram.com/bittybirdco/" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={30} className="Instagram" />
            </a>
        </div>
    );
};

export default SocialLinks;
