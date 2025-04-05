import React, { useState } from "react";
import { useCart } from "../contexts/cartContext.jsx";
import { Link } from "react-router-dom";
import "../css/checkout/cart.css";

const Cart = () => {
    const { cartItems, removeItem, updateQuantity, updatePersonalization } = useCart();

    // ✅ Track edit mode and local input for each product instance
    const [editMode, setEditMode] = useState({});
    const [localPersonalization, setLocalPersonalization] = useState({});

    // Helper function to create a unique key for products
    const getItemKey = (id, personalization) =>
        `${id}-${personalization || ""}`;

    // ✅ Handle Edit Mode Activation
    const handleEditClick = (id, personalization) => {
        const key = getItemKey(id, personalization);
        setEditMode((prev) => ({
            ...prev,
            [key]: true,
        }));
        setLocalPersonalization((prev) => ({
            ...prev,
            [key]: personalization || "",
        }));
    };

    // ✅ Handle Save Personalization
    const handleSaveClick = (id, prevPersonalization) => {
        const key = getItemKey(id, prevPersonalization);
        const newPersonalization = localPersonalization[key];

        // ✅ Avoid merging products by creating a new object reference
        updatePersonalization(id, newPersonalization);

        // Reset local state and edit mode
        setEditMode((prev) => ({
            ...prev,
            [key]: false,
        }));
        setLocalPersonalization((prev) => ({
            ...prev,
            [key]: "",
        }));
    };

    // ✅ Handle Cancel Personalization Edit
    const handleCancelClick = (id, personalization) => {
        const key = getItemKey(id, personalization);
        setEditMode((prev) => ({
            ...prev,
            [key]: false,
        }));
        setLocalPersonalization((prev) => ({
            ...prev,
            [key]: "",
        }));
    };

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {cartItems.map((item) => {
                            const key = getItemKey(item.id, item.personalization);

                            return (
                                <li key={key} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <p className="cart-item-name">{item.name}</p>

                                        {/* ✅ Personalization Section */}
                                        {editMode[key] ? (
                                            <div className="personalization-edit-mode">
                                                <input
                                                    type="text"
                                                    className="cart-item-personalization-input"
                                                    value={localPersonalization[key]}
                                                    onChange={(e) =>
                                                        setLocalPersonalization((prev) => ({
                                                            ...prev,
                                                            [key]: e.target.value
                                                        }))
                                                    }
                                                />
                                                <div className="edit-buttons">
                                                    <button
                                                        className="save-button"
                                                        onClick={() =>
                                                            handleSaveClick(item.id, item.personalization)
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() =>
                                                            handleCancelClick(item.id, item.personalization)
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {item.personalizes !== "N/A" && (
                                                    <>
                                                        {item.personalization && (
                                                            <p className="cart-item-personalization">
                                                                Personalization: {item.personalization}
                                                            </p>
                                                        )}
                                                        <button
                                                            className="edit-personalization-button"
                                                            onClick={() =>
                                                                handleEditClick(item.id, item.personalization)
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {/* ✅ View Item Button */}
                                        <Link to={`/product/${item.productId}`} className="view-item-button">

                                                View Item

                                        </Link>

                                        <p className="cart-item-price">${item.price}</p>
                                        <div className="cart-item-actions">
                                            <input
                                                type="number"
                                                className="cart-item-quantity"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.id,
                                                        parseInt(e.target.value, 10),
                                                        item.personalization
                                                    )
                                                }
                                            />
                                            <button
                                                className="remove-item-button"
                                                onClick={() =>
                                                    removeItem(item.id, item.personalization)
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="cart-footer">
                        <Link to="/checkout">
                            <button className="checkout-button">Proceed to Checkout</button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
