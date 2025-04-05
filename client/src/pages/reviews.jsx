import React from "react";
import ReviewForm from "../components/Review/ReviewForm.jsx"; // Form to submit reviews
import ReviewsList from "../components/Review/ReviewsList.jsx"; // Component to display reviews
import ProductReviewViewer from "../components/Review/ProductReviewViewer.jsx"; // Component to display product reviews
import "../css/Review/reviews.css"; // Import CSS

function Reviews() {
  return (
    <div className="reviews-container">
      <h1>Customer Reviews</h1>
      <ReviewForm /> {/* Review submission form */}
      <ReviewsList /> {/* Display list of reviews */}
      <ProductReviewViewer />
    </div>
  );
}

export default Reviews;
