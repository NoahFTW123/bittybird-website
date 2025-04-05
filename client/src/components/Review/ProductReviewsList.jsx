import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import StarRatingDisplay from "./starRatings";
import "../../css/Review/productReviewList.css";


const API_URL = import.meta.env.VITE_API_URL; // Update for production

function ProductReviewsList({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${productId}/reviews`);
                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setError("Failed to load reviews.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]); // Depend on productId to refetch when it changes

    if (loading) return <p>Loading reviews...</p>;
    if (error) return <p>Error loading reviews: {error}</p>;
    if (reviews.length === 0) return <p>No reviews yet.</p>;

    return (
        <div className="product-reviews-container">
    {reviews.map((review) => (
        <div key={review.id} className="product-review-card">
            <p className="product-review-username">{review.username}</p>
            <div className="product-review-stars">
                <StarRatingDisplay rating={review.rating} />
            </div>
            <p className="product-review-text">{review.review}</p>
        </div>
    ))}
</div>

    );
}

ProductReviewsList.propTypes = {
    productId: PropTypes.string.isRequired,
};

export default ProductReviewsList;
