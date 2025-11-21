import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const JacketsAll = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = "http://localhost:5000";

  // Fetch all products data from API
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/jacketdetails`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        // Validate that we received an array
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API");
        }

        if (data.length === 0) {
          throw new Error("No products found");
        }

        console.log(`Fetched ${data.length} products from API`);
        setAllProducts(data);

        // Find specific product by ID or use first product as default
        let productData;
        if (id) {
          productData = data.find((item) => item.id === parseInt(id));
          if (!productData) {
            throw new Error(`Product with ID ${id} not found`);
          }
        } else {
          productData = data[0]; // Default to first product if no ID specified
        }

        setProduct(productData);

        // Set default color to first available color
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].id);
        }

        // Reset image index when product changes
        setActiveImage(0);
        setImageLoaded(false);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [id]); // Re-fetch when ID changes

  // Set document title when product loads
  useEffect(() => {
    if (product) {
      document.title = `${product.brand || "Allen-Solly"} - ${product.name}`;
    }
  }, [product]);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize("");
      setQuantity(1);
      setActiveImage(0);
      setImageLoaded(false);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].id);
      }
    }
  }, [product]);

  const getCurrentPrice = () => {
    if (!selectedSize || !product) return 0;
    const sizeOption = product.sizes?.find((s) => s.size === selectedSize);
    return sizeOption ? sizeOption.price : 0;
  };

  const getCurrentSizeDetails = () => {
    if (!selectedSize || !product) return null;
    return product.sizes?.find((s) => s.size === selectedSize);
  };

  const getCurrentColorDetails = () => {
    if (!selectedColor || !product) return null;
    return product.colors?.find((c) => c.id === selectedColor);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  // Add to Cart function with MongoDB integration
  const addToCart = async () => {
    if (!selectedSize) {
      setCartMessage("Please select a size before adding to cart");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    if (!product) {
      setCartMessage("Product information not available");
      setTimeout(() => setCartMessage(""), 3000);
      return;
    }

    setAddingToCart(true);

    try {
      const currentPrice = getCurrentPrice();
      const sizeDetails = getCurrentSizeDetails();
      const colorDetails = getCurrentColorDetails();

      // Prepare cart item data
      const cartItem = {
        productId: `jacket_${product.id}_${selectedColor}_${selectedSize}`,
        name: `${product.brand || "Allen-Solly"} - ${product.name}`,
        price: currentPrice,
        originalPrice: product.originalPrice || currentPrice,
        quantity: quantity,
        image:
          product.images?.[activeImage] ||
          product.images?.[0] ||
          "/image/placeholder.jpg",
        color: colorDetails?.name || "Default Color",
        colorValue: colorDetails?.value || "#000000",
        size: selectedSize,
        category: "Jackets",
        brand: product.brand || "Allen-Solly",
        type: product.type || "Jacket",
        productData: {
          id: product.id,
          description: product.description,
          features: product.features,
          specifications: product.specifications,
          rating: product.rating,
          reviewCount: product.reviewCount,
          inStock: product.inStock,
          freeDelivery: product.freeDelivery,
          deliveryTime: product.deliveryTime,
          returnPolicy: product.returnPolicy,
          discount: product.discount,
        },
      };

      console.log("Adding to cart:", cartItem);

      // Send to MongoDB via API
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Item added to cart successfully:", result);

        setCartMessage("✅ Added to cart successfully!");

        // Dispatch custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: {
              action: "add",
              item: result,
              message: `Added ${cartItem.name} to cart`,
            },
          })
        );

        // Optional: Navigate to cart page after a delay
        setTimeout(() => {
          setCartMessage("");
          // Uncomment the next line if you want to redirect to cart
          // navigate('/cart');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartMessage(`❌ Error: ${error.message}`);
      setTimeout(() => setCartMessage(""), 5000);
    } finally {
      setAddingToCart(false);
    }
  };

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

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading product details...</p>
              {allProducts.length > 0 && (
                <small className="text-muted">
                  Loaded {allProducts.length} products
                </small>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger text-center">
            <h4>Error Loading Product</h4>
            <p>{error || "Product not found"}</p>
            <div className="mt-3">
              <a href="/jackets" className="btn btn-primary me-2">
                Back to Jackets
              </a>
              <button
                className="btn btn-outline-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
            {allProducts.length > 0 && (
              <div className="mt-3">
                <small className="text-muted">
                  {allProducts.length} products were loaded successfully
                </small>
              </div>
            )}
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
        {/* Cart Message Alert */}
        {cartMessage && (
          <div
            className={`alert ${
              cartMessage.includes("✅") ? "alert-success" : "alert-danger"
            } alert-dismissible fade show`}
            role="alert"
          >
            {cartMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setCartMessage("")}
            ></button>
          </div>
        )}

        {/* Product breadcrumb and navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/" className="text-decoration-none">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a href="/Jacket" className="text-decoration-none">
                  Jackets
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <small className="text-muted">Showing jacket details</small>
        </div>

        <div className="row g-5">
          {/* Left Column - Images */}
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
                  src={product.images?.[activeImage] || product.images?.[0]}
                  alt={`${product.name} view ${activeImage + 1}`}
                  className={`rounded-3 shadow-lg ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    objectFit: "contain",
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.src = "/image/placeholder.jpg"; // Fallback image
                  }}
                />
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="d-flex gap-2 justify-content-center">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`ratio ratio-1x1 ${
                      activeImage === idx
                        ? "border border-3 border-primary shadow-lg"
                        : "border border-secondary"
                    } rounded-3 overflow-hidden`}
                    style={{
                      width: "70px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      setActiveImage(idx);
                      setImageLoaded(false);
                    }}
                    onMouseEnter={(e) => {
                      if (activeImage !== idx) {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="img-fluid"
                      style={{
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src = "/image/placeholder.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Key Features</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <span
                        key={index}
                        className="badge bg-primary bg-opacity-10 text-primary p-2 px-3 rounded-pill fs-6"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-2">
                {product.brand || "Allen-Solly"} - {product.name}
              </h1>
              {product.rating && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-muted small">
                    ({product.rating} rating) • {product.reviewCount || 0}{" "}
                    Reviews
                  </span>
                </div>
              )}
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  {selectedSize
                    ? `₹${(getCurrentPrice() * quantity).toLocaleString()}`
                    : "Select size for price"}
                </h2>
                {selectedSize && product.originalPrice && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(product.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {selectedSize && product.discount && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              {product.inStock !== undefined && (
                <div className="mt-2 text-success">
                  <small>
                    {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                    {product.freeDelivery && " • Free delivery available"}
                  </small>
                </div>
              )}
            </div>

            <p className="lead mb-4">
              {product.description ||
                `${product.type || "Jacket"} by ${
                  product.brand || "Allen-Solly"
                } - Perfect for any occasion`}
            </p>

            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Size Selection */}
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">Size *</label>
                    <select
                      className="form-select form-select-lg shadow-sm"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      required
                    >
                      <option value="">Select Size</option>
                      {product.sizes?.map((sizeOption) => (
                        <option key={sizeOption.size} value={sizeOption.size}>
                          {sizeOption.size} - ₹
                          {sizeOption.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Selection */}
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

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <label className="form-label fw-semibold mb-3">
                      Color:{" "}
                      {product.colors.find((c) => c.id === selectedColor)
                        ?.name || ""}
                    </label>
                    <div className="d-flex gap-3">
                      {product.colors.map((color) => (
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
                            transition: "transform 0.3s ease-in-out",
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

            {/* Specifications */}
            {product.specifications && (
              <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-semibold mb-3">Specifications:</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {product.specifications.brand && (
                          <li className="mb-2">
                            <strong>Brand:</strong>{" "}
                            {product.specifications.brand}
                          </li>
                        )}
                        {product.specifications.material && (
                          <li className="mb-2">
                            <strong>Material:</strong>{" "}
                            {product.specifications.material}
                          </li>
                        )}
                        {product.specifications.fit && (
                          <li className="mb-2">
                            <strong>Fit:</strong> {product.specifications.fit}
                          </li>
                        )}
                        {selectedColor && (
                          <li className="mb-2">
                            <strong>Color:</strong>{" "}
                            {
                              product.colors.find((c) => c.id === selectedColor)
                                ?.name
                            }
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {product.specifications.careInstructions && (
                          <li className="mb-2">
                            <strong>Care:</strong>{" "}
                            {product.specifications.careInstructions}
                          </li>
                        )}
                        {product.specifications.season && (
                          <li className="mb-2">
                            <strong>Season:</strong>{" "}
                            {product.specifications.season}
                          </li>
                        )}
                        {product.specifications.warranty && (
                          <li className="mb-2">
                            <strong>Warranty:</strong>{" "}
                            {product.specifications.warranty}
                          </li>
                        )}
                        {selectedSize && (
                          <li className="mb-2">
                            <strong>Size:</strong> {selectedSize}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4">
              <button
                className="btn btn-primary btn-lg shadow-sm px-4 d-flex align-items-center gap-2 flex-grow-1"
                disabled={
                  !selectedSize || product.inStock === false || addingToCart
                }
                onClick={addToCart}
              >
                <FiShoppingBag />
                {addingToCart ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Adding...
                  </>
                ) : product.inStock === false ? (
                  "Out of Stock"
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button className="btn btn-outline-secondary btn-lg shadow-sm px-4 d-flex align-items-center gap-2">
                <FiHeart />
                Wishlist
              </button>
            </div>

            {/* View Cart Button */}
            <div className="d-flex gap-3 mb-4">
              <button
                className="btn btn-outline-primary btn-lg shadow-sm px-4 flex-grow-1"
                onClick={() => navigate("/cart")}
              >
                View Cart
              </button>
            </div>

            {/* Delivery Information */}
            <div className="card border-0 rounded-4">
              <div className="card-body p-4">
                {product.freeDelivery && (
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-truck text-success"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 1 1 .001 4A2 2 0 0 1 12 10zm-8 2a2 2 0 1 1 .001 4A2 2 0 0 1 4 12zm0 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                      </svg>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Free Delivery</h6>
                      <small className="text-muted">
                        Delivery within{" "}
                        {product.deliveryTime || "3-5 business days"}
                      </small>
                    </div>
                  </div>
                )}
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className="bi bi-arrow-return-left text-primary"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Easy Returns</h6>
                    <small className="text-muted">
                      {product.returnPolicy || "7-day return policy"}
                    </small>
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

export default JacketsAll;
