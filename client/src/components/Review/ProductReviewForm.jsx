import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { getCurrentUser, loginWithGoogle, logout } from "../../services/login.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";
import "../../css/Review/productReviewForm.css"; // Import CSS

function ProductReviewForm({ productId, refreshReviews }) {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      const loggedInUser = await loginWithGoogle();
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a review!");
      return;
    }

    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }

    if (reviewText.trim() === "") {
      alert("Please enter a review!");
      return;
    }

    try {
      const reviewData = {
        productId, // Ensure the product ID is included
        username: user.email,
        rating,
        review: reviewText,
        createdAt: new Date().toISOString(), // Store timestamp for sorting
      };

      const response = await fetch(`http://localhost:5001/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      alert("Review submitted successfully!");
      setReviewText(""); // Clear form
      setRating(0); // Reset rating
      refreshReviews(); // Refresh the reviews list
    } catch (error) {
      console.error("Error adding review: ", error);
      alert("Failed to submit review.");
    }
  };

  // Function to render stars with hover and half-star support
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1; // Full-star value
      const halfValue = starValue - 0.5; // Half-star value

      return (
        <span
          key={index}
          className="star-container"
          onMouseMove={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const isHalf = e.clientX - left < width / 2;
            setHover(isHalf ? halfValue : starValue);
          }}
          onMouseLeave={() => setHover(0)}
          onClick={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const isHalf = e.clientX - left < width / 2;
            setRating(isHalf ? halfValue : starValue);
          }}
        >
          <FontAwesomeIcon
            icon={
              (hover >= starValue || rating >= starValue)
                ? faStar
                : (hover >= halfValue || rating >= halfValue)
                ? faStarHalfAlt
                : faStarEmpty
            }
            className={`star ${
              (hover >= starValue || rating >= starValue)
                ? "filled"
                : (hover >= halfValue || rating >= halfValue)
                ? "half-filled"
                : "empty"
            }`}
          />
        </span>
      );
    });
  };

  return (
    <div className="product-review-form-container">
      <h2 className="product-review-form-title">Write a Review</h2>

      <div className="auth-buttons">
        {!user ? (
          <button onClick={handleLogin} className="login-btn">Sign in with Google</button>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="product-review-form">
          <div className="star-rating">{renderStars()} <span className="rating-text">{rating}/5</span></div>

          <textarea
            className="product-review-textarea"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>

          <button type="submit" className="product-review-submit-btn">Submit Review</button>
        </form>
      )}
    </div>
  );
}

// Add PropTypes validation
ProductReviewForm.propTypes = {
  productId: PropTypes.string.isRequired, // productId must be a string and required
  refreshReviews: PropTypes.func.isRequired, // refreshReviews must be a function and required
};

export default ProductReviewForm;
