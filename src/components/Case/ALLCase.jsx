import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";

const America1 = ({ productId = 1 }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("black");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(productId);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  // API base URL
  const API_BASE_URL = "http://localhost:5000";

  // Fetch all product data from API
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/CaseDetails`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAllProducts(data);

        // Find the specific product based on currentProductId
        const product = data.find((item) => item.id === currentProductId);

        if (!product) {
          throw new Error(`Product with ID ${currentProductId} not found!`);
        }

        setProductData(product);
        setImageLoaded(false);
        setActiveImage(0);
        // Set initial selected color from the product data
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0].id);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [currentProductId]);

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

    setCurrentProductId(allProducts[newIndex].id);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  // Get selected color details
  const getSelectedColorDetails = () => {
    if (!productData || !productData.colors) return null;
    return productData.colors.find((color) => color.id === selectedColor);
  };

  // Get current image based on active image index and selected color
  const getCurrentImage = () => {
    if (!productData || !productData.images) return "/api/placeholder/200/150";

    // First, try to get color-specific image if available
    const selectedColorDetails = getSelectedColorDetails();

    // If the color has specific images, use those
    if (
      selectedColorDetails &&
      selectedColorDetails.images &&
      selectedColorDetails.images.length > 0
    ) {
      return (
        selectedColorDetails.images[activeImage] ||
        selectedColorDetails.images[0]
      );
    }

    // Otherwise, use the general product images
    return productData.images[activeImage] || productData.images[0];
  };

  // Get price based on selected color (if colors have different prices)
  const getCurrentPrice = () => {
    if (!productData) return 0;

    const selectedColorDetails = getSelectedColorDetails();

    // If color has specific pricing, use that
    if (selectedColorDetails && selectedColorDetails.price) {
      return selectedColorDetails.price;
    }

    // Otherwise use the general product price
    return productData.discountedPrice || productData.price || 0;
  };

  // Get original price based on selected color
  const getCurrentOriginalPrice = () => {
    if (!productData) return 0;

    const selectedColorDetails = getSelectedColorDetails();

    // If color has specific original pricing, use that
    if (selectedColorDetails && selectedColorDetails.originalPrice) {
      return selectedColorDetails.originalPrice;
    }

    // Otherwise use the general product original price
    return productData.originalPrice || productData.price || 0;
  };

  // Handle Add to Cart functionality with API integration
  const handleAddToCart = async () => {
    if (!productData) return;

    setAddToCartLoading(true);

    try {
      const selectedColorDetails = getSelectedColorDetails();
      const currentImage = getCurrentImage();
      const currentPrice = getCurrentPrice();
      const currentOriginalPrice = getCurrentOriginalPrice();

      // Create cart item with selected options
      const cartItem = {
        productId: `${productData.id}_${selectedColor}`,
        name: productData.name || productData.brand || "Unknown Product",
        price: currentPrice,
        quantity: quantity,
        image: currentImage,
        color: selectedColorDetails?.name || selectedColor,
        size: "", // Add size if your product has size options
        category: "Cases", // Since this is from CaseDetails endpoint
      };

      // Send to backend API
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        const addedItem = await response.json();

        // Dispatch custom event to notify cart component
        const cartEvent = new CustomEvent("cartUpdate", {
          detail: {
            product: {
              ...productData,
              quantity: quantity,
              selectedColor: selectedColor,
              selectedColorName: selectedColorDetails?.name || selectedColor,
              selectedColorValue: selectedColorDetails?.value || selectedColor,
              selectedImage: currentImage,
              selectedPrice: currentPrice,
              selectedOriginalPrice: currentOriginalPrice,
              image: currentImage,
              price: currentPrice,
              originalPrice: currentOriginalPrice,
              name: productData.name || productData.brand || "Unknown Product",
              description:
                `${productData.bodyType || ""} ${
                  productData.wheels || ""
                }`.trim() || "No description available",
              category: "Cases",
              cartKey: `${productData.id}_${selectedColor}_default`,
            },
            action: "add",
          },
        });
        window.dispatchEvent(cartEvent);

        // Show success feedback
        const productName = productData.name || productData.brand;
        const colorName = selectedColorDetails?.name || selectedColor;
        alert(`Added ${quantity} ${productName} (${colorName}) to cart!`);

        // Reset quantity to 1 after adding to cart
        setQuantity(1);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add item to cart"}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding item to cart. Please try again.");
    } finally {
      setAddToCartLoading(false);
    }
  };

  // Update document title when product data changes
  useEffect(() => {
    if (productData) {
      document.title = `${productData.brand} - ${productData.name}`;
    }
  }, [productData]);

  // Update active image when color changes
  useEffect(() => {
    // Reset to first image when color changes
    setActiveImage(0);
    setImageLoaded(false);
  }, [selectedColor]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i - 0.5 <= rating) {
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

  // Get images to display based on selected color
  const getImagesToDisplay = () => {
    const selectedColorDetails = getSelectedColorDetails();

    // If color has specific images, use those
    if (
      selectedColorDetails &&
      selectedColorDetails.images &&
      selectedColorDetails.images.length > 0
    ) {
      return selectedColorDetails.images;
    }

    // Otherwise use general product images
    return productData.images || [];
  };

  const imagesToDisplay = getImagesToDisplay();
  const currentPrice = getCurrentPrice();
  const currentOriginalPrice = getCurrentOriginalPrice();
  const discount =
    currentOriginalPrice > currentPrice
      ? Math.round(
          ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
        )
      : productData.discount || 0;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Navigation buttons */}
        {allProducts.length > 1 && (
          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigateToProduct("prev")}
            >
              <FiArrowLeft /> Previous Product
            </button>
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={() => navigateToProduct("next")}
            >
              Next Product <FiArrowRight />
            </button>
          </div>
        )}

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
                  src={getCurrentImage()}
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
            <div className="d-flex gap-2 justify-content-center">
              {imagesToDisplay.map((img, idx) => (
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
                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-2">{productData.brand}</h1>
              <h2 className="h3 mb-3">{productData.name}</h2>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex gap-1">
                  {renderStars(productData.rating)}
                </div>
                <span className="text-muted small">
                  ({productData.rating} rating)
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  ₹{currentPrice.toLocaleString()}
                </h2>
                {currentOriginalPrice > currentPrice && (
                  <>
                    <span className="text-decoration-line-through text-muted">
                      ₹{currentOriginalPrice.toLocaleString()}
                    </span>
                    <span className="badge bg-success">{discount}% OFF</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="lead mb-2">Specifications:</p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Body Type:</strong> {productData.bodyType}
                </li>
                <li className="mb-2">
                  <strong>Wheels:</strong> {productData.wheels}
                </li>
              </ul>
            </div>

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
                <div className="mt-4">
                  <label className="form-label fw-semibold mb-3">
                    Color: {getSelectedColorDetails()?.name || selectedColor}
                  </label>
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
                  <div className="mt-2">
                    <small className="text-muted">
                      Selected:{" "}
                      {getSelectedColorDetails()?.name || selectedColor}
                    </small>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="d-grid gap-2 mt-4">
                  <button
                    className="btn btn-primary btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart}
                    disabled={addToCartLoading}
                  >
                    {addToCartLoading ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <FiShoppingBag /> Add to Cart
                      </>
                    )}
                  </button>
                  <button className="btn btn-outline-danger btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2">
                    <FiHeart /> Add to Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Product Information */}
            <div className="mt-4">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <h5 className="card-title">Product Information</h5>
                  <div className="row g-3">
                    <div className="col-6">
                      <small className="text-muted">Brand</small>
                      <div className="fw-semibold">{productData.brand}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Model</small>
                      <div className="fw-semibold">{productData.name}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Body Type</small>
                      <div className="fw-semibold">{productData.bodyType}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Wheels</small>
                      <div className="fw-semibold">{productData.wheels}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default America1;
