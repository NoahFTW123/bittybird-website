import React, { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginWithGoogle, logout, onAuthStateChange } from "../../services/login.js"
import "../../css/Navbar.css"

function Navbar({ onHeightChange }) {
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const navbarRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current && onHeightChange) {
        onHeightChange(navbarRef.current.offsetHeight)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [onHeightChange])

  const handleLogin = async () => {
    try {
      const loggedInUser = await loginWithGoogle()
      setUser(loggedInUser)
      window.location.reload()
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      window.location.reload()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setShowSearch(false);
    }
};

  return (
    <header className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        {/* Title */}
        <div className="navbar-title">
          <h1><Link to="/" className="nav-link">BITTYBIRD & CO.</Link></h1>
        </div>

        {/* Links */}
        <nav className="navbar-links">
        <div className="dropdown-wrapper">
        <Link to="/products" className="nav-link">SHOP BY PRODUCTS</Link>
            <div className="mega-dropdown">
                <div className="dropdown-column">
                    <h3>Products</h3>
                    <span className="dropdown-link" onClick={() => window.location.href = "/products?tag=christ"}>Christ</span>
                    <span className="dropdown-link" onClick={() => window.location.href = "/products?tag=keychain"}>Keychains</span>
                    <span className="dropdown-link" onClick={() => window.location.href = "/products?tag=ornament"}>Ornaments</span>
                    <span className="dropdown-link" onClick={() => window.location.href = "/products?tag=missionary"}>Missionary</span>
                </div>
            </div>
        </div>
          <div className="dropdown-wrapper">
            <Link to="/about" className="nav-link">ABOUT</Link>
            <div className="mega-dropdown">
              <div className="dropdown-column">
                <h3>About Us</h3>
                <Link to="/contact">Contact Us</Link>
              </div>
            </div>
          </div>
          <div className="dropdown-wrapper">
            <Link to="/reviews" className="nav-link">REVIEWS</Link>
          </div>
        </nav>

        {/* Right Buttons */}
        <div className="navbar-actions">
          <button className="navbar-btn" onClick={() => setShowSearch(!showSearch)}>Search</button>
          {showSearch && (
            <div className="search-dropdown">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn" type="submit">Go</button>
              </form>
            </div>
          )}
          {user ? (
            <>
              <span className="user-info">Welcome, {user.displayName}</span>
              <button className="navbar-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="navbar-btn" onClick={handleLogin}>Login</button>
          )}
          <Link to="/cart" className="navbar-btn">Cart</Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
