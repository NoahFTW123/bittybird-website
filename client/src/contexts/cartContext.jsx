import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { updateDoc } from "firebase/firestore";
import { onAuthStateChange } from "../services/login";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            setUserId(user ? user.uid : "guest");
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const cartRef = doc(collection(db, "carts"), userId);

        const unsubscribe = onSnapshot(cartRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setCartItems(docSnapshot.data().items || []);
            } else {
                setCartItems([]);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    const saveCartToFirebase = async (updatedCart) => {
        if (!userId) return;

        const cartRef = doc(collection(db, "carts"), userId);

        await updateDoc(cartRef, {
            items: updatedCart.map((item) => ({
                id: item.stableId || `${item.id}-${crypto.randomUUID()}`,
                productId: item.productId || item.id,
                personalization: item.personalization || "",
                personalizes: item.personalizes || "N/A",
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                name: item.name, // optional, if you want to display name in cart
            })),
        });
    };

    const getItemKey = (id, personalization) =>
        `${id}-${personalization || ""}`;

    const addItem = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(
                (i) =>
                    getItemKey(i.id, i.personalization) ===
                    getItemKey(item.id, item.personalization)
            );

            let updatedCart;
            if (existingItem) {
                updatedCart = prevItems.map((i) =>
                    getItemKey(i.id, i.personalization) === getItemKey(item.id, item.personalization)
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                const newItem = {
                    ...item,
                    stableId: item.stableId || `${item.id}-${crypto.randomUUID()}`
                };
                updatedCart = [...prevItems, newItem];
            }

            saveCartToFirebase(updatedCart);
            return updatedCart;
        });
    };

    const removeItem = (id, personalization) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter(
                (item) =>
                    getItemKey(item.id, item.personalization) !== getItemKey(id, personalization)
            );

            saveCartToFirebase(updatedCart);
            return updatedCart;
        });
    };

    const updatePersonalization = (id, newPersonalization) => {
        setCartItems((prevItems) => {
            const originalItem = prevItems.find(
                (item) => getItemKey(item.id, item.personalization) === getItemKey(id, item.personalization)
            );

            if (!originalItem) return prevItems;

            const index = prevItems.findIndex(
                (item) =>
                    getItemKey(item.id, item.personalization) ===
                    getItemKey(originalItem.id, originalItem.personalization)
            );

            if (index === -1) return prevItems;

            const updatedItem = {
                ...originalItem,
                personalization: newPersonalization,
                stableId: originalItem.stableId
            };

            const updatedCart = [...prevItems];
            updatedCart.splice(index, 1, updatedItem);

            saveCartToFirebase(updatedCart);
            return updatedCart;
        });
    };

    const updateQuantity = (id, quantity, personalization) => {
        if (quantity <= 0) {
            removeItem(id, personalization);
            return;
        }

        setCartItems((prevItems) => {
            const updatedCart = prevItems.map((item) =>
                getItemKey(item.id, item.personalization) === getItemKey(id, personalization)
                    ? { ...item, quantity }
                    : item
            );

            saveCartToFirebase(updatedCart);
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCartItems([]); // Clear local state

        if (!userId) return;

        const cartRef = doc(collection(db, "carts"), userId);
        // Overwrite with empty array in Firestore
        updateDoc(cartRef, { items: [] });
    };



    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItem,
                removeItem,
                updateQuantity,
                updatePersonalization,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
