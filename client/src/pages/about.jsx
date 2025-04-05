import React from 'react';
import Hero from "../components/About/hero.jsx";
import AboutContent from "../components/About/aboutContent.jsx";
import Footer from "../components/General/footer.jsx";
import FAQs from "../components/About/faqs.jsx";
import "../css/About/about.css";

function About() {
    return (
        <div>
            <Hero title="About Us" subtitle="Learn more about our journey" />
            <AboutContent />
            < FAQs />
            <Footer />
        </div>
    );
}

export default About;