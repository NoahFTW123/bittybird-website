import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/cartContext.jsx";
import ProductReviewForm from "../components/Review/ProductReviewForm";
import ProductReviewsList from "../components/Review/ProductReviewsList";
import "../css/Products/productsDetails.css";

const API_URL = import.meta.env.VITE_API_URL; // Update for production


const ProductDetails = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [finalPrice, setFinalPrice] = useState(0);
    const [personalization, setPersonalization] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();
                setProduct(data);
                setCurrentImage(data.thumbnail); // Default image
                setFinalPrice(parseFloat(data.price));
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        let basePrice = parseFloat(product.price);
        let discount = 0;

        if (quantity === 50) {
            discount = 0.8042;
        } else if (quantity === 25) {
            discount = 0.7642;
        } else if (quantity === 10) {
            discount = 0.7443;
        }

        const newPrice =
            discount > 0 ? basePrice * (1 - discount) * quantity : basePrice * quantity;
        setFinalPrice(newPrice.toFixed(2));
    }, [quantity, product]);

    const handleAddToCart = () => {
        if (!product) return;
    
        const cartItem = {
            id: product.id,
            productId: product.id,
            name: product.name,
            image: currentImage,
            price: finalPrice / quantity,
            quantity: quantity,
            personalization: personalization.trim(),
            personalizes: product.personalize,
          };

        console.log("Adding to cart item:", cartItem);
        addItem(cartItem);
        alert(`${product.name} added to cart!`);
    };
    
    if (loading) return <h2>Loading...</h2>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return null;

    return (
        <div className="product-page">
            {/* Left: Product Images */}
            <div className="product-media">
                <div className="product-images">
                    <img src={currentImage} alt={product.name} className="main-image" />
                    <div className="thumbnail-gallery">
                        {[product.thumbnail, ...product.photos].map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Thumbnail ${index}`}
                                className={`thumbnail ${currentImage === img ? "active" : ""}`}
                                onClick={() => setCurrentImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="product-reviews">
                    <h2>Customer Reviews</h2>
                    <ProductReviewsList productId={id} />  {/* Display product reviews */}
                    <ProductReviewForm productId={id} />  {/* Form to submit new reviews */}
                </div>
            </div>

            {/* Right: Product Info */}
            <div className="product-info">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-price">
                    {quantity >= 10 && (
                        <span className="original-price">
                            ${(product.price * quantity).toFixed(2)}
                        </span>
                    )}
                    Total Price: ${finalPrice}
                </p>

                <p className="materials">
                    <strong>Materials:</strong> {product.materials.join(", ")}
                </p>
                <p className="sizes">
                    <strong>Size:</strong> {product.size.join(", ")}
                </p>

                <div className="product-tags">
                    {product.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Quantity Selector */}
                <div className="quantity-selector">
                    <label htmlFor="quantity">Quantity:</label>
                    <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 10, 25, 50].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Personalization (Only if Available) */}
                {product.personalize !== "N/A" && (
                    <div className="personalization-section">
                        <label htmlFor="personalization">
                        <strong>Personalization:</strong> {product.personalize}
                        </label>
                        <textarea
                        id="personalization"
                        value={personalization}
                        onChange={(e) => setPersonalization(e.target.value)}
                        placeholder="Enter your personalization details here..."
                        ></textarea>
                    </div>
                    )}
                    
                {/* Add to Cart Button */}
                <button className="add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                </button>

                {/* Description */}
                <div className="product-description">
                    <h2>Description</h2>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
