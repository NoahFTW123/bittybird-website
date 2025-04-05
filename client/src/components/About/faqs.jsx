import { useState } from "react";

const faqs = [
    { question: "What do you do?", answer: "We make ornaments, signs, or anything anyone wants using our laser engraver."},
    { question: "Can I have my order customized?", answer: "Yes, all orders can be customized to what is needed. There are some limitations that we will have set."},
    {question:"What materials can you engrave on?", answer:"We can engrave on a wide variety of materials, including wood, acrylic, glass, coated metal, leather, and fabric."},
    {question:"Can I order custom quantities of item?", answer:"Yes, you can order custom quantities. Just contact us!"},
    {question:"What types of designs can be engraved?", answer:"We can engrave logos, text, images, and custom artwork. Our laser engravers can handle intricate and detailed designs."},
    {question:"Can you engrave on both sides of an item?", answer:"Yes, we can engrave on both side of most items, but the feasibility depends on the shape and size of the object."},
    {question:"What is the minimum order quantity?", answer:"We can handle both small one-off orders and bulk orders. There is no minimum order requirement, though larder orders may receive discounts."},
    {question:"Can I provide my own design for engraving?", answer:"Absolutely! We accept customer-provided artwork in various formats, such as AI, SVG, PNG, or JPEG. Our team can also help you refine your design if needed."},
    {question:"Are there any restrictions on the size of the items you can cut or engrave?", answer:"We can engrave items of various sizes, but there may be limits based on our equipment's capacity. Our laser is a Thunder Nova 51 with a 35 inch by 51 inch bed. Please reach out to us for specifics on size limitations."},
    {question:"What is your return or refund policy?", answer:"We stand by the quality of our work, but if there's an issue with the engraving or material, we will work with you to resolve it. Please refer to our return and refund policy for specific details."},

]

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="fags-section">
            <h2 className="faqs-title">Frequently Asked Questions</h2>
            <div className="faqs-container">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3 className="faq-question"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            {faq.question}
                        </h3>
                        {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default FAQs;