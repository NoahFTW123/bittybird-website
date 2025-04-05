import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/cartContext.jsx";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import "../css/checkout/checkout.css"

const API_URL = import.meta.env.VITE_API_URL;

const countryCodes = [
    "US", "CA", "GB", "AU", "DE", "FR", "IN", "JP", "CN", "MX"
];

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const [orderComplete, setOrderComplete] = useState(false);
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [sameAsBilling, setSameAsBilling] = useState(false);

    const [billingAddress, setBillingAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        state: "",
        city: "",
        address: "",
        address2: "",
        zipCode: "",
    });

    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        state: "",
        city: "",
        address: "",
        address2: "",
        zipCode: "",
    });

    const handleTokenize = async (token, buyer) => {
        try {
            if (!token || !token.token) {
                throw new Error("Invalid token received from Square");
            }

            const response = await fetch(`${API_URL}/create/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sourceId: token.token,
                    amount: Math.round(totalAmount * 100), // Convert dollars to cents
                    currency: "USD",
                    buyer,
                    billingAddress,
                    shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
                }),
            });

            const data = await response.json();
            console.log("Payment response:", data);

            if (data.payment && data.payment.status === "COMPLETED") {
                setOrderComplete(true);
                await fetch(`${API_URL}/send-order-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        billingAddress,
                        shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
                        cartItems,
                        total: totalAmount,
                    }),
                });
                clearCart();
            } else {
                console.error("Payment failed:", data);
                alert("Payment failed. Check console for details.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred during payment.");
        }

    };

    const handleChange = (e, type)  => {
        const {name,value} = e.target;
        if (type === "billing") {
            setBillingAddress((prev) => ({ ...prev, [name]: value }));
            if (sameAsBilling) {
                setShippingAddress((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setShippingAddress((prev) => ({ ...prev, [name]: value }));
        }
    }

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <section className="order-summary">
                <h2>Order Summary</h2>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id}>
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <p><strong>Total: ${totalAmount.toFixed(2)}</strong></p>
            </section>

            <section className="form-section">
                <h2>Billing Address</h2>

                {/* First Name & Last Name - Two Columns */}
                <div className="form-group">
                    <input className="half-width" type="text" name="firstName" placeholder="First Name"
                           onChange={(e) => handleChange(e, "billing")}/>
                    <input className="half-width" type="text" name="lastName" placeholder="Last Name"
                           onChange={(e) => handleChange(e, "billing")}/>
                </div>

                {/* Full-Width Fields */}
                <div className="form-group">
                    <input className="full-width" type="email" name="email" placeholder="Email"
                           onChange={(e) => handleChange(e, "billing")}/>
                    <input className="full-width" type="text" name="address" placeholder="Address"
                           onChange={(e) => handleChange(e, "billing")}/>
                    <input className="full-width" type="text" name="address2" placeholder="Apartment, Suite, etc."
                           onChange={(e) => handleChange(e, "billing")}/>
                </div>


                {/* City, State, Zip - Three Columns */}
                <div className="form-group">
                    <input className="third-width" type="text" name="city" placeholder="City"
                           onChange={(e) => handleChange(e, "billing")}/>
                    <input className="third-width" type="text" name="state" placeholder="State"
                           onChange={(e) => handleChange(e, "billing")}/>
                    <input className="third-width" type="text" name="zipCode" placeholder="Zip Code"
                           onChange={(e) => handleChange(e, "billing")}/>
                </div>

                {/* Country Selection */}
                <div className="select-container">
                    <select className="full-width" name="country" onChange={(e) => handleChange(e, "billing")}>
                        <option value="">Select Country</option>
                        {countryCodes.map((code) => (
                            <option key={code} value={code}>{displayNames.of(code)}</option>
                        ))}
                    </select>
                </div>
            </section>


            <div className="checkbox-container">
                <input type="checkbox" checked={sameAsBilling} onChange={() => setSameAsBilling(!sameAsBilling)}/>
                <label>Shipping address same as billing</label>
            </div>

            {!sameAsBilling && (
                <section className="form-section">
                    <h2>Shipping Address</h2>
                    <div className="form-group">
                        <input className="half-width" type="text" name="firstName" placeholder="First Name"
                               onChange={(e) => handleChange(e, "billing")}/>
                        <input className="half-width" type="text" name="lastName" placeholder="Last Name"
                               onChange={(e) => handleChange(e, "billing")}/>
                    </div>

                    {/* Full-Width Fields */}
                    <div className="form-group">
                        <input className="full-width" type="email" name="email" placeholder="Email"
                               onChange={(e) => handleChange(e, "billing")}/>
                        <input className="full-width" type="text" name="address" placeholder="Address"
                               onChange={(e) => handleChange(e, "billing")}/>
                        <input className="full-width" type="text" name="address2" placeholder="Apartment, Suite, etc."
                               onChange={(e) => handleChange(e, "billing")}/>
                    </div>


                    {/* City, State, Zip - Three Columns */}
                    <div className="form-group">
                        <input className="third-width" type="text" name="city" placeholder="City"
                               onChange={(e) => handleChange(e, "billing")}/>
                        <input className="third-width" type="text" name="state" placeholder="State"
                               onChange={(e) => handleChange(e, "billing")}/>
                        <input className="third-width" type="text" name="zipCode" placeholder="Zip Code"
                               onChange={(e) => handleChange(e, "billing")}/>
                    </div>

                    {/* Country Selection */}
                    <div className="select-container">
                        <select className="full-width" name="country" onChange={(e) => handleChange(e, "billing")}>
                            <option value="">Select Country</option>
                            {countryCodes.map((code) => (
                                <option key={code} value={code}>{displayNames.of(code)}</option>
                            ))}
                        </select>
                    </div>
                </section>
            )}

            <section className="payment-section">
                <h2>Payment Details</h2>
                <PaymentForm
                    applicationId="sandbox-sq0idb-CwIDy2fpZxmfqawpiU3xTw"
                    locationId="L32T6NP2XFTSJ"
                    cardTokenizeResponseReceived={handleTokenize}
                    createVerificationDetails={() => ({
                        amount: totalAmount.toFixed(2),
                        currencyCode: "USD",
                        intent: "CHARGE",
                        billingContact: {
                            familyName: billingAddress.lastName,
                            givenName: billingAddress.firstName,
                            email: billingAddress.email,
                            countryCode: billingAddress.country,
                            city: billingAddress.city,
                            addressLines: [billingAddress.address, billingAddress.address2],
                            postalCode: billingAddress.zipCode,
                        },
                    })}
                >
                    <CreditCard/>
                </PaymentForm>
            </section>

        </div>


    );
};

export default Checkout;
