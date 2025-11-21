import React, { useState, useEffect } from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HeadsetDetails = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState({ show: false, text: '', type: 'success' });

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/headsetAll`);

        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }

        const data = await response.json();
        console.log("Fetched products:", data); // Debug log

        if (!data || data.length === 0) {
          throw new Error("No products found");
        }

        setProducts(data);

        // Set current product index based on ID or default to first product
        if (id) {
          const productIndex = data.findIndex(
            (item) => item.id === parseInt(id) || item.id === id
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
      setSelectedColor(
        currentProduct.specifications?.defaultColor ||
          currentProduct.specifications?.color ||
          currentProduct.colorOptions?.[0]?.id ||
          ""
      );
      setSelectedModel("");
      setQuantity(1);
      setActiveImage(0);
      setImageLoaded(false);
      document.title = `${currentProduct.brand} - ${currentProduct.name}`;
    }
  }, [currentProduct, currentProductIndex]);

  // Navigation functions - FIXED
  const goToPrevious = () => {
    if (products.length === 0) return;

    const newIndex =
      currentProductIndex > 0 ? currentProductIndex - 1 : products.length - 1;
    console.log("Going to previous:", newIndex, "Product:", products[newIndex]); // Debug log

    setCurrentProductIndex(newIndex);

    // Update URL without page reload - FIXED PATH
    if (products[newIndex]) {
      navigate(`/headset/${products[newIndex].id}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (products.length === 0) return;

    const newIndex =
      currentProductIndex < products.length - 1 ? currentProductIndex + 1 : 0;
    console.log("Going to next:", newIndex, "Product:", products[newIndex]); // Debug log

    setCurrentProductIndex(newIndex);

    // Update URL without page reload - FIXED PATH
    if (products[newIndex]) {
      navigate(`/headset/${products[newIndex].id}`, { replace: true });
    }
  };

  const getCurrentPrice = () => {
    if (!currentProduct) return 0;

    if (!selectedModel) {
      return (
        (currentProduct?.discountedPrice || currentProduct?.price || 0) *
        quantity
      );
    }

    const modelOption = currentProduct.modelOptions?.find(
      (m) => m.model === selectedModel
    );

    if (modelOption) {
      return modelOption.price * quantity;
    }

    return (
      (currentProduct.discountedPrice || currentProduct.price || 0) * quantity
    );
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  // Function to add product to cart
  const handleAddToCart = async () => {
    if (!currentProduct || addingToCart) return;

    try {
      setAddingToCart(true);
      
      // Get selected model price or default price
      let selectedPrice = getCurrentPrice() / quantity; // Divide by quantity to get unit price
      
      // Prepare cart item data
      const cartItem = {
        productId: `headset_${currentProduct.id}_${selectedColor || 'default'}`,
        name: currentProduct.name,
        price: selectedPrice,
        quantity: quantity,
        image: productImages[activeImage] || productImages[0] || currentProduct.image,
        color: currentProduct.colorOptions?.find(c => c.id === selectedColor)?.name || selectedColor || '',
        size: selectedModel || '',
        category: 'Headsets',
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
        text: `Added ${currentProduct.name} to your cart!`,
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

  const getProductImages = () => {
    if (!currentProduct) return [];

    if (currentProduct.images && Array.isArray(currentProduct.images)) {
      return currentProduct.images;
    }

    if (currentProduct.image) {
      return [currentProduct.image];
    }

    return [];
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
              <p className="text-muted">Loading headset details...</p>
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
            <p>{error || "Headset not found"}</p>
            <a href="/AllHeadsets" className="btn btn-primary">
              Back to Headsets
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = getProductImages();

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {/* Product Navigation Header - ENHANCED */}
       
        {/* Product breadcrumb - FIXED PATHS */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/headset" className="text-decoration-none">
                Headsets
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {currentProduct.name}
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
                {/* Main Image */}
                <img
                  key={`${currentProduct.id}-${activeImage}`} // Force re-render when product changes
                  src={
                    productImages[activeImage] ||
                    productImages[0] ||
                    currentProduct.image ||
                    "/api/placeholder/400/400"
                  }
                  alt={`${currentProduct.name} view ${activeImage + 1}`}
                  className={`rounded-3 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    objectFit: "contain",
                    transition: "opacity 0.3s ease-in-out",
                  }}
                  onLoad={handleImageLoad}
                  onError={() => setImageLoaded(true)} // Handle broken images
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="d-flex justify-content-center gap-3 mt-3">
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

            {/* Key features card */}
            {(currentProduct.features || currentProduct.keyFeatures) && (
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Key Features</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {(
                      currentProduct.features ||
                      currentProduct.keyFeatures ||
                      []
                    ).map((feature, index) => (
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
              <h1 className="display-5 fw-bold mb-2">{currentProduct.name}</h1>
              <p className="text-muted mb-3">By {currentProduct.brand}</p>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex gap-1">
                  {renderStars(currentProduct.rating)}
                </div>
                <span className="text-muted small">
                  ({currentProduct.rating || 0}) •{" "}
                  {currentProduct.reviewCount || 0} Reviews
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  ₹{getCurrentPrice().toLocaleString()}
                </h2>
                {currentProduct.originalPrice && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹
                    {(currentProduct.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {currentProduct.discount && (
                  <span className="badge bg-success rounded-pill px-3">
                    {currentProduct.discount}% OFF
                  </span>
                )}
              </div>
              <div className="mt-2">
                {currentProduct.inStock !== false ? (
                  <span className="text-success">
                    <small>✓ In Stock</small>
                  </span>
                ) : (
                  <span className="text-danger">
                    <small>✗ Out of Stock</small>
                  </span>
                )}
                {currentProduct.freeDelivery && (
                  <span className="text-success ms-3">
                    <small>✓ Free delivery available</small>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {currentProduct.description && (
              <div className="mb-4">
                <p className="text-muted">{currentProduct.description}</p>
              </div>
            )}

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

            {/* Color selector */}
            {currentProduct.colorOptions &&
              currentProduct.colorOptions.length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Select Color:
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {currentProduct.colorOptions.map((color) => (
                      <div
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`border rounded-3 p-3 ${
                          selectedColor === color.id
                            ? "border-primary bg-primary bg-opacity-10"
                            : ""
                        }`}
                        style={{ cursor: "pointer", minWidth: "120px" }}
                      >
                        <div className="text-center">
                          <div
                            className="rounded-circle mx-auto mb-2"
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: color.id.toLowerCase(),
                              border: "1px solid #dee2e6",
                            }}
                          ></div>
                          {color.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Model selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Select Model:</label>
                <select
                  className="form-select form-select-lg shadow-sm rounded-3"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="">Select Model</option>
                  {currentProduct.modelOptions?.map((modelOption) => (
                    <option key={modelOption.model} value={modelOption.model}>
                      {modelOption.model} - ₹
                      {modelOption.price.toLocaleString()}
                    </option>
                  ))}
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

            {/* Specifications card */}
            {currentProduct.specifications && (
              <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-semibold">Specifications:</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {currentProduct.specifications.brand && (
                          <li className="mb-2">
                            <strong>Brand:</strong>{" "}
                            {currentProduct.specifications.brand}
                          </li>
                        )}
                        {currentProduct.specifications.model && (
                          <li className="mb-2">
                            <strong>Model:</strong>{" "}
                            {currentProduct.specifications.model}
                          </li>
                        )}
                        {currentProduct.specifications.type && (
                          <li className="mb-2">
                            <strong>Type:</strong>{" "}
                            {currentProduct.specifications.type}
                          </li>
                        )}
                        {currentProduct.specifications.connectivity && (
                          <li className="mb-2">
                            <strong>Connectivity:</strong>{" "}
                            {currentProduct.specifications.connectivity}
                          </li>
                        )}
                        {currentProduct.specifications.connection && (
                          <li className="mb-2">
                            <strong>Connection:</strong>{" "}
                            {currentProduct.specifications.connection}
                          </li>
                        )}
                        {currentProduct.specifications.batteryLife && (
                          <li className="mb-2">
                            <strong>Battery Life:</strong>{" "}
                            {currentProduct.specifications.batteryLife}
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        {currentProduct.specifications.noiseCancellation && (
                          <li className="mb-2">
                            <strong>Noise Cancellation:</strong>{" "}
                            {currentProduct.specifications.noiseCancellation}
                          </li>
                        )}
                        {currentProduct.specifications.weight && (
                          <li className="mb-2">
                            <strong>Weight:</strong>{" "}
                            {currentProduct.specifications.weight}
                          </li>
                        )}
                        {currentProduct.specifications.color && (
                          <li className="mb-2">
                            <strong>Color:</strong>{" "}
                            {currentProduct.specifications.color}
                          </li>
                        )}
                        {currentProduct.specifications.defaultColor && (
                          <li className="mb-2">
                            <strong>Default Color:</strong>{" "}
                            {currentProduct.specifications.defaultColor}
                          </li>
                        )}
                        {currentProduct.specifications.warranty && (
                          <li className="mb-2">
                            <strong>Warranty:</strong>{" "}
                            {currentProduct.specifications.warranty}
                          </li>
                        )}
                        {currentProduct.specifications.driverSize && (
                          <li className="mb-2">
                            <strong>Driver Size:</strong>{" "}
                            {currentProduct.specifications.driverSize}
                          </li>
                        )}
                        {currentProduct.specifications.waterResistance && (
                          <li className="mb-2">
                            <strong>Water Resistance:</strong>{" "}
                            {currentProduct.specifications.waterResistance}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {(currentProduct.aboutThisItem || currentProduct.aboutItem) &&
                    (currentProduct.aboutThisItem || currentProduct.aboutItem)
                      .length > 0 && (
                      <>
                        <h5 className="fw-semibold mt-4">About this item:</h5>
                        <ul className="list-group list-group-flush bg-transparent">
                          {(
                            currentProduct.aboutThisItem ||
                            currentProduct.aboutItem
                          ).map((item, index) => (
                            <li
                              key={index}
                              className="list-group-item bg-transparent border-0 px-0"
                            >
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-primary btn-lg shadow-sm px-4 py-3 flex-grow-1 rounded-3 d-flex align-items-center justify-content-center gap-2"
                disabled={currentProduct.inStock === false || addingToCart}
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
                    {currentProduct.inStock !== false ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
              <button className="btn btn-outline-secondary btn-lg shadow-sm px-4 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2">
                <FiHeart />
                Wishlist
              </button>
            </div>

            {/* Delivery options */}
            <div className="card border-0 rounded-4 mt-4">
              <div className="card-body p-4">
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
                      {currentProduct.deliveryTime ||
                        "Standard delivery within 3-5 business days"}
                    </small>
                  </div>
                </div>
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
                      {currentProduct.returnPolicy || "30-day return policy"}
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

export default HeadsetDetails;