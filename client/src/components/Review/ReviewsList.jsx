import React, { useEffect, useState } from "react";
import { db } from "../../services/firebaseConfig.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";
import "../../css/Review/reviewsList.css";

function ReviewsList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), where("id", "==", "reviews")); // ✅ Only website reviews
        const querySnapshot = await getDocs(q);
        const reviewsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Function to display star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const halfValue = starValue - 0.5;

      return (
        <FontAwesomeIcon
          key={index}
          icon={
            rating >= starValue
              ? faStar
              : rating >= halfValue
              ? faStarHalfAlt
              : faStarEmpty
          }
          className={`star ${
            rating >= starValue
              ? "filled"
              : rating >= halfValue
              ? "half-filled"
              : "empty"
          }`}
        />
      );
    });
  };

  return (
    <div className="reviews-list">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3 className="username">{review.username}</h3>
            <div className="rating">
              {renderStars(review.rating)} <span className="rating-number">{review.rating}/5</span>
            </div>
            <p className="review-text">{review.review}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}

export default ReviewsList;
