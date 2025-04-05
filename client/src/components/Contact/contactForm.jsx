import React, { useState } from "react";

const ContactForm = () => {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        const response = await fetch("http://localhost:5001/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            setStatus("Message sent!");
            setEmail("");
            setMessage("");
        } else {
            setStatus("Failed to send. Try again later.");
        }
    };

    return (
        <div className="contactForm">
            <h2 className="message">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="formSubmit">
                <input
                    type="name"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className='name'
                />
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="email"
                />
                <textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="textMessage"
                />
                <button type="submit" className="btnSubmit">
                    Send
                </button>
            </form>
            {status && <p className="status">{status}</p>}
        </div>
    );
};

export default ContactForm;