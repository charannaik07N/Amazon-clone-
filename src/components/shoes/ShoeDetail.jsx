import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";

const ShoeDetail = () => {
  // Get product ID from URL parameters using useParams hook
  const { id } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(
    id ? parseInt(id) : null
  );
  const [currentPrice, setCurrentPrice] = useState(0);
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  // Fetch all product data from API
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/AllShoe");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Log what we're getting from the API to debug
        console.log("API response data:", data);

        if (!data || data.length === 0) {
          throw new Error("No shoe products available");
        }

        setAllProducts(data);

        // Set initial product ID if not already set
        const targetId =
          currentProductId || (data.length > 0 ? data[0].id : null);

        if (!targetId) {
          throw new Error("No products available");
        }

        // Find the specific product based on targetId or use the first product
        const product = data.find((item) => item.id === targetId) || data[0];

        console.log("Selected product:", product);

        setCurrentProductId(product.id);
        setProductData(product);
        setImageLoaded(false);
        setActiveImage(0);

        // Set initial selected color from the product data
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0].id);
        }

        // Set initial selected size and price
        if (product.sizes && product.sizes.length > 0) {
          setSelectedSize(product.sizes[0].size);
          setCurrentPrice(product.sizes[0].price);
        } else {
          // If no sizes available, use discountedPrice as fallback
          setCurrentPrice(product.discountedPrice || product.price || 0);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [id, currentProductId]);

  // Update price when size changes
  const handleSizeChange = (size) => {
    setSelectedSize(size.size);
    setCurrentPrice(size.price);
  };

  // Navigate to previous/next product
  const navigateToProduct = (direction) => {
    if (!allProducts || allProducts.length <= 1) return;

    const currentIndex = allProducts.findIndex(
      (p) => p.id === currentProductId
    );
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % allProducts.length;
    } else {
      newIndex = (currentIndex - 1 + allProducts.length) % allProducts.length;
    }

    const newProduct = allProducts[newIndex];
    setCurrentProductId(newProduct.id);

    // Update URL to reflect the new product
    navigate(`/shoe/${newProduct.id}`);
  };

  // Function to navigate to AllShoe's product detail page
  const navigateToAllShoeDetail = () => {
    if (productData && productData.brand) {
      navigate(`/product/${productData.brand.toLowerCase()}/${productData.id}`);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };
  
  // Add to cart functionality
  const handleAddToCart = async () => {
    if (!productData || addingToCart) return;
    
    try {
      setAddingToCart(true);
      
      // Get selected color name if available
      const colorName = selectedColor && productData.colors 
        ? productData.colors.find(c => c.id === selectedColor)?.name || ''
        : '';
      
      // Prepare cart item data
      const cartItem = {
        productId: `shoe_${productData.id}_${selectedSize || 'default'}_${selectedColor || 'default'}`,
        name: productData.name,
        price: currentPrice || productData.discountedPrice || productData.price || 0,
        quantity: quantity,
        image: productData.images && productData.images.length > 0 
          ? productData.images[activeImage] 
          : "/api/placeholder/400/400",
        color: colorName,
        size: selectedSize || '',
        category: 'Shoes',
        brand: productData.brand || '',
      };

      // Send POST request to add item to cart
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const data = await response.json();
      
      // Show success message
      setCartMessage({
        show: true,
        text: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your cart!`,
        type: 'success'
      });

      // Dispatch cart update event for other components
      window.dispatchEvent(new CustomEvent('cartUpdate', {
        detail: { product: cartItem, action: 'add' }
      }));

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setCartMessage(prev => ({ ...prev, show: false }));
      }, 5000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage({
        show: true,
        text: error.message || 'Failed to add item to cart. Please try again.',
        type: 'danger'
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Update document title when product data changes
  useEffect(() => {
    if (productData) {
      document.title = productData.brand
        ? `${productData.brand} - ${productData.name}`
        : productData.name;
    }
  }, [productData]);

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= numRating) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i - 0.5 <= numRating) {
        stars.push(<FaStarHalf key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }
    return stars;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show error message if fetch failed
  if (error || !productData) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Product</h4>
            <p>
              {error || "Failed to load product data. Please try again later."}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Cart message alert */}
        {cartMessage.show && (
          <div className={`alert alert-${cartMessage.type} alert-dismissible fade show`} role="alert">
            {cartMessage.text}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setCartMessage({ ...cartMessage, show: false })}
              aria-label="Close"
            ></button>
          </div>
        )}
        
        {/* Navigation buttons */}
        <div className="d-flex justify-content-between mb-4">
          {allProducts.length > 1 && (
            <>
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={() => navigateToProduct("prev")}
              >
                <FiArrowLeft /> Previous Shoe
              </button>
              <button
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={() => navigateToProduct("next")}
              >
                Next Shoe <FiArrowRight />
              </button>
            </>
          )}
        </div>

        <div className="row g-5">
          <div className="col-lg-6">
            <div className="position-relative mb-4">
              <div className="ratio ratio-1x1">
                {!imageLoaded && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <img
                  src={
                    productData.images && productData.images.length > 0
                      ? productData.images[activeImage]
                      : "/api/placeholder/400/400"
                  }
                  alt={`${productData.name} view ${activeImage + 1}`}
                  className={`rounded-3 shadow-lg ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    objectFit: "contain",
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onLoad={handleImageLoad}
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {productData.images && productData.images.length > 1 && (
              <div className="d-flex gap-2 justify-content-center">
                {productData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`ratio ratio-1x1 ${
                      activeImage === idx
                        ? "border border-3 border-primary shadow-lg"
                        : "border hover:border-primary"
                    } rounded-3 overflow-hidden`}
                    style={{
                      width: "70px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img
                      src={img}
                      alt={`${productData.name} thumbnail ${idx + 1}`}
                      className="img-fluid"
                      style={{
                        objectFit: "contain",
                        transition: "transform 0.2s ease-in-out",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            <div className="mb-4">
              {productData.brand && (
                <h1 className="display-5 fw-bold mb-2">{productData.brand}</h1>
              )}
              <h2 className="h3 mb-3">{productData.name}</h2>

              {productData.rating && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex gap-1">
                    {renderStars(productData.rating)}
                  </div>
                  <span className="text-muted small">
                    ({productData.rating} rating)
                  </span>
                </div>
              )}

              <div className="d-flex align-items-baseline gap-2">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  ₹
                  {(
                    currentPrice ||
                    productData.discountedPrice ||
                    productData.price ||
                    0
                  ).toLocaleString()}
                </h2>
                {productData.originalPrice && productData.discount && (
                  <>
                    <span className="text-decoration-line-through text-muted">
                      ₹{productData.originalPrice.toLocaleString()}
                    </span>
                    <span className="badge bg-success">
                      {productData.discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {productData.description && (
              <div className="mb-4">
                <p className="lead">{productData.description}</p>
              </div>
            )}

            {/* Additional specifications if available */}
            {(productData.bodyType || productData.wheels) && (
              <div className="mb-4">
                <p className="lead mb-2">Specifications:</p>
                <ul className="list-unstyled">
                  {productData.bodyType && (
                    <li className="mb-2">
                      <strong>Body Type:</strong> {productData.bodyType}
                    </li>
                  )}
                  {productData.wheels && (
                    <li className="mb-2">
                      <strong>Wheels:</strong> {productData.wheels}
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">Quantity</label>
                    <div className="input-group input-group-lg shadow-sm">
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() =>
                          quantity > 1 && setQuantity(quantity - 1)
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max="10"
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() =>
                          quantity < 10 && setQuantity(quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Size Selection - Only show if we have sizes */}
                {productData.sizes && productData.sizes.length > 0 && (
                  <div className="mt-4">
                    <label className="form-label fw-semibold mb-3">Size</label>
                    <div className="d-flex flex-wrap gap-2">
                      {productData.sizes.map((size) => (
                        <button
                          key={size.size}
                          className={`btn ${
                            selectedSize === size.size
                              ? "btn-primary shadow"
                              : "btn-outline-secondary"
                          }`}
                          style={{
                            minWidth: "60px",
                            transition: "all 0.2s ease-in-out",
                          }}
                          onClick={() => handleSizeChange(size)}
                        >
                          {size.size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection - Only show if we have colors */}
                {productData.colors && productData.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="form-label fw-semibold mb-3">Color</label>
                    <div className="d-flex gap-3">
                      {productData.colors.map((color) => (
                        <button
                          key={color.id}
                          className={`rounded-circle border-3 ${
                            selectedColor === color.id
                              ? "border-primary shadow-lg"
                              : "border-secondary"
                          }`}
                          style={{
                            backgroundColor: color.value,
                            width: "48px",
                            height: "48px",
                            cursor: "pointer",
                            transition: "all 0.2s ease-in-out",
                          }}
                          onClick={() => setSelectedColor(color.id)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <button 
                className="btn btn-primary btn-lg flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>
                    <FiLoader className="fs-5 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <FiShoppingBag className="fs-5" /> Add to bag
                  </>
                )}
              </button>
              <button className="btn btn-outline-primary btn-lg px-4 shadow-sm hover:shadow transition-shadow">
                <FiHeart className="fs-5" />
              </button>
            </div>

            {/* Button to navigate to the AllShoe's detailed view */}
            <button
              onClick={navigateToAllShoeDetail}
              className="btn btn-outline-secondary w-100 mb-4"
            >
              View in All Shoes Detail Page
            </button>

            {/* Product selection dropdown for mobile view */}
            {allProducts.length > 1 && (
              <div className="mt-4 d-md-none">
                <label className="form-label fw-semibold">
                  Browse Other Shoes
                </label>
                <select
                  className="form-select form-select-lg"
                  value={currentProductId}
                  onChange={(e) => {
                    const newId = parseInt(e.target.value);
                    navigate(`/shoe/${newId}`);
                    setCurrentProductId(newId);
                  }}
                >
                  {allProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.brand ? `${product.brand} - ` : ""}
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoeDetail;