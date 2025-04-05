import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/General/Navbar.jsx";
import Home from "./pages/home.jsx";
import About from "./pages/about.jsx";
import Contact from "./pages/contact.jsx";
import Reviews from "./pages/reviews.jsx";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import { CartProvider } from "./contexts/cartContext.jsx";
import ProductPage from "./pages/productPage.jsx";
import ProductDetails from "./pages/productDetails.jsx";
import AdminPage from "./pages/adminPage.jsx";
import { onAuthStateChange, checkAdminRole } from "./services/login.js";

function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [navbarHeight, setNavbarHeight] = useState(10) // default fallback

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const isAdminUser = await checkAdminRole(user.uid)
        setIsAdmin(isAdminUser)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <CartProvider>
      <>
        <Navbar onHeightChange={setNavbarHeight} />
        <main style={{ paddingTop: `${Math.max(navbarHeight - 75, 0)}px` }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            {isAdmin && <Route path="/admin" element={<AdminPage />} />}
          </Routes>
        </main>
      </>
    </CartProvider>
  )
}


export default App;
