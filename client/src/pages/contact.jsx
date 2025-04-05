import React from 'react';
import SocialLinks from "../components/Contact/socialLinks.jsx";
import ContactForm from "../components/Contact/contactForm.jsx";
import Footer from "../components/General/footer.jsx";
import "../css/About/contact.css";

function Contact() {
    return (
        <>
            <div className="ContactPage">
                <div className="Contact">
                    <h1 className="ContactTitle">Contact Us</h1>
                    <SocialLinks/>
                    <ContactForm/>

                </div>
            </div>
            <Footer/>
        </>

    );
}

export default Contact;