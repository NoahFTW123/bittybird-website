import React, { useState, useEffect } from "react";
import { loginWithGoogle, logout, onAuthStateChange } from "../../services/login.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";
import { db } from "../../services/firebaseConfig.js";
import { collection, doc, setDoc } from "firebase/firestore";
import "../../css/Review/reviewForm.css";

function ReviewForm() {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Track login state in real-time using onAuthStateChange()
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
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
      const reviewRef = doc(collection(db, "reviews"));

      const reviewData = {
        id: "reviews", // Hardcoded ID for website-wide reviews
        username: user.email,
        rating,
        review: reviewText,
        createdAt: new Date().toISOString(), // Ensure correct timestamp
      };

      await setDoc(reviewRef, reviewData);

      alert("Review submitted successfully!");
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error("Error adding review: ", error);
      alert("Failed to submit review.");
    }
  };

  // Render stars with half-star support
  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const halfValue = starValue - 0.5;

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
    <div className="review-form-container">
      <h2>Write a Review</h2>

      {/* Login/Logout buttons */}
      <div className="auth-buttons">
        {!user ? (
          <button onClick={handleLogin} className="login-btn">Sign in with Google</button>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>

      {/* Show form only if user is logged in */}
      {user && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="star-rating">
            {renderStars()} <span className="rating-text">{rating}/5</span>
          </div>

          <textarea
            className="review-textarea"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>

          <button type="submit" className="submit-btn">Submit Review</button>
        </form>
      )}
    </div>
  );
}

export default ReviewForm;
