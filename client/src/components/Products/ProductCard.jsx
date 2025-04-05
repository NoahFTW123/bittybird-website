import { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Products/productCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";


const ProductCard = ({ product, addItem }) => {
    const [showScreen, setShowScreen] = useState(false);
    const [personalization, setPersonalization] = useState("");

    const handleAddToCart = () => {
        if (product.personalize && product.personalize !== "N/A") {
            setShowScreen(true);
        } else {
            addToCart("");
        }
    };

    const addToCart = (enteredPersonalization) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.thumbnail,
            price: parseFloat(product.price),
            quantity: 1,
            personalization: enteredPersonalization,
            personalizes: product.personalize,
        };

        addItem(cartItem);
        alert(`${product.name} added to cart!`);
        setShowScreen(false);
    };

    return (
        <div className="product-card">
            <img src={product.thumbnail} alt={product.name} className="product-image" />
            <h3 className="product-title">{product.name}</h3>
            <p className="product-price">${product.price}</p>

            <div className="product-buttons">
                <Link to={`/product/${product.id}`} className="view-details">
                    View Details
                </Link>
                <button className="addCart" onClick={handleAddToCart}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
            </div>


            {/* Full-Screen Personalization Overlay */}
            {showScreen && (
                <div className="full-screen-overlay">
                    <div className="overlay-content">
                        <h2>Additional Action Required</h2>
                        <p>
                            This item requires personalization.  Please enter it below:
                        </p>

                        <p> {product.personalize} </p>

                        <textarea
                            value={personalization}
                            onChange={(e) => setPersonalization(e.target.value)}
                            placeholder="Enter personalization..."
                        ></textarea>
                        <div className="overlay-buttons">
                            <button onClick={() => addToCart(personalization)}>Confirm</button>
                            <button onClick={() => setShowScreen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
