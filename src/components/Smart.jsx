import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiInfo,
} from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Smart = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  
  // Add state for cart operations
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/watchAll`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched products:", data);

        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error("No products found");
        }

        // Handle both array and single object responses
        const productsArray = Array.isArray(data) ? data : [data];
        setProducts(productsArray);

        // Set current product index based on ID
        if (id) {
          const productIndex = productsArray.findIndex(
            (item) =>
              String(item.id) === String(id) || String(item._id) === String(id)
          );
          setCurrentProductIndex(productIndex >= 0 ? productIndex : 0);
        } else {
          setCurrentProductIndex(0);
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Get current product
  const currentProduct = products[currentProductIndex];

  // Reset selections when product changes
  useEffect(() => {
    if (currentProduct) {
      // Set default color
      if (
        currentProduct.colorOptions &&
        currentProduct.colorOptions.length > 0
      ) {
        setSelectedColor(
          currentProduct.colorOptions[0].id ||
            currentProduct.colorOptions[0].name ||
            currentProduct.colorOptions[0]
        );
      } else if (currentProduct.specifications?.color) {
        setSelectedColor(currentProduct.specifications.color);
      } else if (currentProduct.color) {
        setSelectedColor(currentProduct.color);
      } else {
        setSelectedColor("");
      }

      // Set default model
      if (
        currentProduct.modelOptions &&
        currentProduct.modelOptions.length > 0
      ) {
        setSelectedModel(
          currentProduct.modelOptions[0].model ||
            currentProduct.modelOptions[0].name ||
            ""
        );
      } else {
        setSelectedModel("");
      }

      setQuantity(1);
      setActiveImage(0);
      setImageLoaded(false);

      // Update document title
      const title = `${currentProduct.brand || "Product"} - ${
        currentProduct.name || "Details"
      }`;
      document.title = title;
    }
  }, [currentProduct, currentProductIndex]);

  // Navigation functions
  const goToPrevious = () => {
    if (products.length === 0) return;
    const newIndex =
      currentProductIndex > 0 ? currentProductIndex - 1 : products.length - 1;
    setCurrentProductIndex(newIndex);
    if (products[newIndex]) {
      const productId = products[newIndex].id || products[newIndex]._id;
      navigate(`/headset/${productId}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (products.length === 0) return;
    const newIndex =
      currentProductIndex < products.length - 1 ? currentProductIndex + 1 : 0;
    setCurrentProductIndex(newIndex);
    if (products[newIndex]) {
      const productId = products[newIndex].id || products[newIndex]._id;
      navigate(`/headset/${productId}`, { replace: true });
    }
  };

  // Price calculation
  const getCurrentPrice = () => {
    if (!currentProduct) return 0;

    let basePrice = 0;

    // Try to get price from various possible fields
    if (selectedModel && currentProduct.modelOptions) {
      const modelOption = currentProduct.modelOptions.find(
        (m) => m.model === selectedModel || m.name === selectedModel
      );
      if (modelOption && modelOption.price) {
        basePrice = modelOption.price;
      }
    }

    if (basePrice === 0) {
      basePrice =
        currentProduct.discountedPrice ||
        currentProduct.salePrice ||
        currentProduct.price ||
        currentProduct.cost ||
        0;
    }

    return basePrice * quantity;
  };

  // Get original price for discount display
  const getOriginalPrice = () => {
    if (!currentProduct) return 0;

    const originalPrice =
      currentProduct.originalPrice ||
      currentProduct.listPrice ||
      currentProduct.msrp ||
      (currentProduct.price && currentProduct.discountedPrice
        ? currentProduct.price
        : 0);

    return originalPrice * quantity;
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    const original = getOriginalPrice() / quantity;
    const current = getCurrentPrice() / quantity;

    if (original > current && original > 0) {
      return Math.round(((original - current) / original) * 100);
    }

    return currentProduct.discount || currentProduct.discountPercent || 0;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  // Add to cart functionality
  const handleAddToCart = async () => {
    if (!currentProduct || addingToCart || !isInStock()) return;

    try {
      setAddingToCart(true);
      
      // Get current price
      const currentPrice = getCurrentPrice() / quantity;
      
      // Get color name
      let colorName = selectedColor;
      if (currentProduct.colorOptions) {
        const colorOption = currentProduct.colorOptions.find(
          c => c.id === selectedColor || c.name === selectedColor
        );
        if (colorOption) {
          colorName = colorOption.name || colorOption.label || selectedColor;
        }
      }
      
      // Prepare cart item data
      const cartItem = {
        productId: `watch_${currentProduct.id || currentProduct._id}_${selectedColor || 'default'}_${selectedModel || 'default'}`,
        name: currentProduct.name || currentProduct.title || "Smart Watch",
        price: currentPrice,
        quantity: quantity,
        image: getProductImages()[activeImage] || getProductImages()[0] || currentProduct.image || "/api/placeholder/400/400",
        color: colorName || '',
        size: selectedModel || '',
        category: 'Smart Watches',
        brand: currentProduct.brand || currentProduct.manufacturer || '',
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
        text: `Added ${currentProduct.name || 'Smart Watch'} to your cart!`,
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

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating) || 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= numericRating) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i - 0.5 <= numericRating) {
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

  // Enhanced image handling
  const getProductImages = () => {
    if (!currentProduct) return [];

    let images = [];

    // Check multiple possible image fields
    if (currentProduct.images && Array.isArray(currentProduct.images)) {
      images = currentProduct.images;
    } else if (
      currentProduct.imageUrls &&
      Array.isArray(currentProduct.imageUrls)
    ) {
      images = currentProduct.imageUrls;
    } else if (
      currentProduct.pictures &&
      Array.isArray(currentProduct.pictures)
    ) {
      images = currentProduct.pictures;
    } else if (currentProduct.image) {
      images = [currentProduct.image];
    } else if (currentProduct.imageUrl) {
      images = [currentProduct.imageUrl];
    } else if (currentProduct.picture) {
      images = [currentProduct.picture];
    }

    // Filter out empty/invalid images
    return images.filter(
      (img) => img && typeof img === "string" && img.trim() !== ""
    );
  };

  // Check stock status
  const isInStock = () => {
    if (currentProduct.inStock !== undefined) {
      return currentProduct.inStock;
    }
    if (currentProduct.stock !== undefined) {
      return currentProduct.stock > 0;
    }
    if (currentProduct.stockStatus) {
      return currentProduct.stockStatus.toLowerCase() === "in stock";
    }
    if (currentProduct.availability) {
      return currentProduct.availability.toLowerCase().includes("available");
    }
    return true; // Default to in stock if no clear indication
  };

  // Render specifications
  const renderSpecifications = () => {
    if (
      !currentProduct.specifications &&
      !currentProduct.specs &&
      !currentProduct.details
    ) {
      return null;
    }

    const specs =
      currentProduct.specifications ||
      currentProduct.specs ||
      currentProduct.details ||
      {};
    const specEntries = Object.entries(specs).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    );

    if (specEntries.length === 0) return null;

    return (
      <div className="row">
        {specEntries.map(([key, value], index) => (
          <div key={key} className={`col-md-6 ${index % 2 === 0 ? "" : ""}`}>
            <div className="mb-2">
              <strong className="text-capitalize">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </strong>
              <span className="ms-2">
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render features/key points
  const renderFeatures = () => {
    const features =
      currentProduct.features ||
      currentProduct.keyFeatures ||
      currentProduct.highlights ||
      currentProduct.benefits ||
      [];

    if (!Array.isArray(features) || features.length === 0) return null;

    return (
      <div className="d-flex flex-wrap gap-2">
        {features.map((feature, index) => (
          <span
            key={index}
            className="badge bg-primary bg-opacity-10 text-primary p-2 px-3 rounded-pill fs-6"
          >
            {feature}
          </span>
        ))}
      </div>
    );
  };

  // Render about this item
  const renderAboutItem = () => {
    const aboutItems =
      currentProduct.aboutThisItem ||
      currentProduct.aboutItem ||
      currentProduct.description ||
      currentProduct.details ||
      [];

    if (Array.isArray(aboutItems) && aboutItems.length > 0) {
      return (
        <ul className="list-group list-group-flush bg-transparent">
          {aboutItems.map((item, index) => (
            <li
              key={index}
              className="list-group-item bg-transparent border-0 px-0"
            >
              • {item}
            </li>
          ))}
        </ul>
      );
    } else if (typeof aboutItems === "string" && aboutItems.length > 0) {
      return <p className="text-muted">{aboutItems}</p>;
    }

    return null;
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
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !currentProduct) {
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger text-center">
            <h4>Error</h4>
            <p>{error || "Product not found"}</p>
            <button
              onClick={() => window.history.back()}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = getProductImages();
  const discountPercentage = getDiscountPercentage();
  const originalPrice = getOriginalPrice();

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

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/SmartWatches" className="text-decoration-none">
                Watches
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {currentProduct.name || "Product Details"}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Left Column - Images */}
          <div className="col-lg-6">
            <div className="position-relative mb-4">
              <div className="ratio ratio-1x1 bg-light rounded-4 p-4">
                {!imageLoaded && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <img
                  key={`${
                    currentProduct.id || currentProduct._id
                  }-${activeImage}`}
                  src={
                    productImages[activeImage] ||
                    productImages[0] ||
                    "/api/placeholder/400/400"
                  }
                  alt={`${currentProduct.name || "Product"} view ${
                    activeImage + 1
                  }`}
                  className={`rounded-3 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    objectFit: "contain",
                    transition: "opacity 0.3s ease-in-out",
                    width: "100%",
                    height: "100%",
                  }}
                  onLoad={handleImageLoad}
                  onError={() => setImageLoaded(true)}
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`rounded-4 p-2 ${
                      activeImage === index
                        ? "bg-light border border-primary"
                        : "bg-light"
                    }`}
                    style={{ cursor: "pointer", width: "80px", height: "80px" }}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="img-fluid rounded-3"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Key Features Card */}
            {renderFeatures() && (
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    <FiStar className="me-2" />
                    Key Features
                  </h5>
                  {renderFeatures()}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            {/* Product Header */}
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-2">
                {currentProduct.name || currentProduct.title || "Product Name"}
              </h1>
              <p className="text-muted mb-3">
                By{" "}
                {currentProduct.brand || currentProduct.manufacturer || "Brand"}
              </p>

              {/* Rating */}
              {(currentProduct.rating || currentProduct.averageRating) && (
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex gap-1">
                    {renderStars(
                      currentProduct.rating || currentProduct.averageRating
                    )}
                  </div>
                  <span className="text-muted small">
                    ({currentProduct.rating || currentProduct.averageRating}) •{" "}
                    {currentProduct.reviewCount || currentProduct.reviews || 0}{" "}
                    Reviews
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="d-flex align-items-baseline gap-2 mb-3">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  ₹{getCurrentPrice().toLocaleString("en-IN")}
                </h2>
                {originalPrice > getCurrentPrice() && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </p>
                )}
                {discountPercentage > 0 && (
                  <span className="badge bg-success rounded-pill px-3">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Stock and Delivery Info */}
              <div className="d-flex flex-wrap gap-3 mb-3">
                {isInStock() ? (
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                    ✗ Out of Stock
                  </span>
                )}
                {(currentProduct.freeDelivery ||
                  currentProduct.freeShipping) && (
                  <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                    <FiTruck className="me-1" />
                    Free Delivery
                  </span>
                )}
                {currentProduct.warranty && (
                  <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2">
                    <FiShield className="me-1" />
                    {currentProduct.warranty}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {(currentProduct.shortDescription || currentProduct.summary) && (
              <div className="mb-4">
                <p className="text-muted">
                  {currentProduct.shortDescription || currentProduct.summary}
                </p>
              </div>
            )}

            {/* Color Selector */}
            {currentProduct.colorOptions &&
              currentProduct.colorOptions.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Select Color:
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {currentProduct.colorOptions.map((color, index) => {
                      const colorId = color.id || color.name || color;
                      const colorName = color.name || color.label || color;
                      const colorValue =
                        color.value || color.hex || colorId.toLowerCase();

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedColor(colorId)}
                          className={`border rounded-3 p-3 ${
                            selectedColor === colorId
                              ? "border-primary bg-primary bg-opacity-10"
                              : "border-light"
                          }`}
                          style={{ cursor: "pointer", minWidth: "120px" }}
                        >
                          <div className="text-center">
                            <div
                              className="rounded-circle mx-auto mb-2"
                              style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: colorValue,
                                border: "1px solid #dee2e6",
                              }}
                            ></div>
                            <small>{colorName}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Model/Variant Selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Select Model:</label>
                <select
                  className="form-select form-select-lg shadow-sm rounded-3"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="">Choose Model</option>
                  {(
                    currentProduct.modelOptions ||
                    currentProduct.variants ||
                    []
                  ).map((option, index) => {
                    const modelName =
                      option.model ||
                      option.name ||
                      option.variant ||
                      `Option ${index + 1}`;
                    const modelPrice =
                      option.price ||
                      option.cost ||
                      getCurrentPrice() / quantity;

                    return (
                      <option key={index} value={modelName}>
                        {modelName} - ₹{modelPrice.toLocaleString("en-IN")}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Quantity:</label>
                <input
                  type="number"
                  className="form-control form-control-lg shadow-sm rounded-3"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-transparent border-0 p-0">
                <ul className="nav nav-tabs border-0">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "details" ? "active" : ""
                      } border-0`}
                      onClick={() => setActiveTab("details")}
                    >
                      <FiInfo className="me-2" />
                      Details
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "specifications" ? "active" : ""
                      } border-0`}
                      onClick={() => setActiveTab("specifications")}
                    >
                      Specifications
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body p-4">
                {activeTab === "details" && (
                  <div>
                    {renderAboutItem()}
                    {!renderAboutItem() && (
                      <p className="text-muted">
                        No detailed description available.
                      </p>
                    )}
                  </div>
                )}
                {activeTab === "specifications" && (
                  <div>
                    {renderSpecifications()}
                    {!renderSpecifications() && (
                      <p className="text-muted">No specifications available.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4">
              <button
                className="btn btn-primary btn-lg shadow-sm px-4 py-3 flex-grow-1 rounded-3 d-flex align-items-center justify-content-center gap-2"
                disabled={!isInStock() || addingToCart}
                onClick={handleAddToCart}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiShoppingBag />
                    {isInStock() ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
              <button className="btn btn-outline-secondary btn-lg shadow-sm px-4 py-3 rounded-3 d-flex align-items-center justify-content-center">
                <FiHeart />
              </button>
            </div>

            {/* Delivery and Return Info */}
            <div className="card border-0 bg-light rounded-4">
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                        <FiTruck className="text-success" size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">Free Delivery</h6>
                        <small className="text-muted">
                          {currentProduct.deliveryTime || "3-5 business days"}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                        <FiRotateCcw className="text-primary" size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">Easy Returns</h6>
                        <small className="text-muted">
                          {currentProduct.returnPolicy ||
                            "30-day return policy"}
                        </small>
                      </div>
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

export default Smart;