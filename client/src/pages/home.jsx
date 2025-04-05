import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/General/footer.jsx";
import ProductCard from "../components/Products/ProductCard.jsx";
import { useCart } from "../contexts/cartContext.jsx";
import "../css/home.css";
import Banner from "../components/banner.jsx";





const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // Filter only featured products
        const featured = data.filter(product => product.tags.includes("featured"));
        setFeaturedProducts(featured);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchProducts();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      <Banner/>

      <div className="hero">
        <h1>Welcome to BittyBird & Co</h1>
        <p>Find the best products at unbeatable prices!</p>
        <Link to="/products">
          <button className="btn-1">Shop Now</button>
        </Link>
      </div>

      {/* Featured Products Section */}
      <div className="featured-section">
        <h2>Featured Products</h2>
        <div className="scroll-wrapper">
          <button className="scroll-btn left" onClick={scrollLeft}>❮</button>
          <div className="featured-products" ref={scrollContainerRef}>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} addItem={addItem} />
            ))}
          </div>
          <button className="scroll-btn right" onClick={scrollRight}>❯</button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
