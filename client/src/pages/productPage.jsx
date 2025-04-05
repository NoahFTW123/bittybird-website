import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../contexts/cartContext.jsx";
import ProductCard from "../components/Products/ProductCard.jsx";
import SidebarFilters from "../components/Products/SidebarFilters.jsx";
import Footer from "../components/General/footer.jsx";
import "../css/Products/productPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const ProductsPage = () => {
    const { addItem } = useCart();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    
    const initialTag = searchParams.get("tag") || "";
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTags, setSelectedTags] = useState(initialTag ? [initialTag] : []);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [searchQuery, setSearchQuery] = useState(""); 

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
      const tagFromURL = searchParams.get("tag");
      const searchFromURL = searchParams.get("search");
    
      if (tagFromURL) {
        setSelectedTags([tagFromURL]);
      } else {
        setSelectedTags([]);
      }
    
      if (searchFromURL) {
        setSearchQuery(searchFromURL);
      } else {
        setSearchQuery("");
      }
    
      setCurrentPage(1);
    }, [location.search]);
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products/`);
                if (!response.ok) throw new Error("Failed to fetch products");

                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products.filter((product) => {
          const price = parseFloat(product.price);
          const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
          const matchesTags = selectedTags.length === 0 || 
                              selectedTags.every(tag => product.tags.includes(tag));
          const matchesSearch = searchQuery === "" || 
                                product.name.toLowerCase().includes(searchQuery.toLowerCase());
        
          return matchesPrice && matchesTags && matchesSearch;
      });
      
    

        setFilteredProducts(filtered);
    }, [selectedTags, priceRange, searchQuery, products]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
      <main className="page-content">
        <div className="products-page">
          <SidebarFilters 
            setPriceRange={setPriceRange} 
            selectedTags={selectedTags} 
            setSelectedTags={setSelectedTags} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
          
          <div className="products-container-page">
            {loading ? (
              <h2>Loading...</h2>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : currentProducts.length > 0 ? (
              currentProducts.map(product => (
                <ProductCard key={product.id} product={product} addItem={addItem} />
              ))
            ) : (
              <p className="no-products-message">No products match your filters.</p>
            )}
          </div>
        </div>
        <Footer />
      </main>
    );
};

export default ProductsPage;