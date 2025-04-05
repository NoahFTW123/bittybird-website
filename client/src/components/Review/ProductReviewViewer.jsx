import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import StarRatingDisplay from "./starRatings";

// const settings = React.lazy(() => import("../../css/Review/productReviewViewer.css"));

const ProductReviewViewer = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        import("../../css/Review/productReviewViewer.css");
    }, []);


    // ✅ Step 1: Fetch products for the dropdown
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const productsSnapshot = await getDocs(collection(db, "products"));
          const productsList = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(productsList);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
  
      fetchProducts();
    }, []);
  
    // ✅ Step 2: Fetch reviews based on productId
    useEffect(() => {
      if (!selectedProductId) return;
  
      const fetchReviews = async () => {
        setLoading(true);
        try {
          console.log(`Fetching reviews for productId: ${selectedProductId}`);
          
          // ✅ Query the `reviews` collection by productId
          const reviewsRef = collection(db, "reviews");
          const q = query(reviewsRef, where("productId", "==", selectedProductId));
          const querySnapshot = await getDocs(q);
  
          console.log("Fetched reviews:", querySnapshot.docs.map(doc => doc.data()));
  
          if (!querySnapshot.empty) {
            const reviewsList = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setReviews(reviewsList);
          } else {
            console.warn(`No reviews found for product: ${selectedProductId}`);
            setReviews([]);
          }
        } catch (error) {
          console.error("Error fetching product reviews:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchReviews();
    }, [selectedProductId]);
  
    return (
      <div className="product-review-viewer">
        <h2>Product Reviews</h2>
  
        {/* ✅ Dropdown for selecting products */}
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="product-select"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
  
        {/* ✅ Display product reviews */}
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="product-reviews">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <p><strong>{review.username}</strong></p>
                <StarRatingDisplay rating={parseFloat(review.rating)} />
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        ) : selectedProductId ? (
          <p>No reviews for this product yet.</p>
        ) : null}
      </div>
    );
  };
  
  export default ProductReviewViewer;
