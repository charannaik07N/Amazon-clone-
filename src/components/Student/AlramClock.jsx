import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const AlarmClock = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [selectedModel, setSelectedModel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 6,
    brand: "Casio",
    originalPrice: 500,
    discountedPrice: 400,
    rating: 4,
    discount: 20,
    name: "Alarm Clock",
    image: "./image/clock.webp",
    type: "Alarm Clock",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/clock.webp", // Main image
      "/image/Student/clock1 (1).jpg",
      "/image/Student/clock1 (2).jpg",
      "/image/Student/clock1 (3).jpg",
      "/image/Student/clock1 (4).jpg",
    ];
  };

  const images = getProductImages();

  const colors = [
    { id: "black", value: "#000000", name: "Classic Black" },
    { id: "white", value: "#FFFFFF", name: "Pure White" },
    { id: "red", value: "#FF0000", name: "Vibrant Red" },
  ];

  const models = [
    { model: "Basic Alarm", price: 400 },
    { model: "Digital Display", price: 500 },
    { model: "Smart Alarm with Snooze", price: 600 },
  ];

  const getCurrentPrice = () => {
    if (!selectedModel) return 0;
    const modelOption = models.find((m) => m.model === selectedModel);
    return modelOption ? modelOption.price * quantity : 0;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

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

  useEffect(() => {
    if (product) {
      document.title = `${product.brand} - ${product.name}`;
    }
  }, [product]);

  if (!product) {
    return <div className="container my-5">Product not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
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
                {/* Main Image */}
                <img
                  src={images[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
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

            {/* Thumbnail Images */}
            <div className="d-flex justify-content-center gap-2 mt-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail rounded-3 ${
                    activeImage === index ? "border-primary" : ""
                  }`}
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-6">
            <div className="mb-4">
              <h1 className="display-5 fw-bold mb-2">
                {product.brand} - {product.name}
              </h1>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-muted small">
                  ({product.rating} rating)
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <h2 className="display-6 fw-bold text-primary mb-0">
                  {selectedModel
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select model for price"}
                </h2>
                {selectedModel && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(product.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {selectedModel && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              {product.type} by {product.brand} - Reliable timekeeping for your
              daily needs
            </p>

            {/* Color selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Color:</label>
              <div className="d-flex gap-2">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`border rounded-circle p-1 ${
                      selectedColor === color.id
                        ? "border-primary border-2"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        backgroundColor: color.value,
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border:
                          color.id === "white" ? "1px solid #ddd" : "none",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <p className="small mt-1">
                Selected: {colors.find((c) => c.id === selectedColor)?.name}
              </p>
            </div>

            {/* Model selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Select Model:</label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <option value="">Select Model</option>
                  {models.map((modelOption) => (
                    <option key={modelOption.model} value={modelOption.model}>
                      {modelOption.model}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Quantity:</label>
                <input
                  type="number"
                  className="form-control form-control-lg shadow-sm"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
            </div>

            {/* Specifications card */}
            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold">Specifications:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Brand:</strong> Casio
                      </li>
                      <li className="mb-2">
                        <strong>Display Type:</strong> Digital
                      </li>
                      <li className="mb-2">
                        <strong>Material:</strong> High-quality plastic
                      </li>
                      <li className="mb-2">
                        <strong>Power Source:</strong> Battery operated
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Alarm Function:</strong> Yes (multiple)
                      </li>
                      <li className="mb-2">
                        <strong>Dimensions:</strong> 10 x 7 x 3 cm
                      </li>
                      <li className="mb-2">
                        <strong>Weight:</strong> 120g
                      </li>
                      <li className="mb-2">
                        <strong>Battery Life:</strong> Approx. 1 year
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Easy-to-read digital display with backlight for nighttime
                    visibility.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Multiple alarm settings with adjustable volume and snooze
                    function.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Compact, lightweight design perfect for travel or bedside
                    table.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Energy-efficient with long-lasting battery life.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Durable construction with shock-resistant casing.
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-3 mt-3">
              <button className="btn btn-primary btn-lg shadow-sm px-4 d-flex align-items-center gap-2">
                <FiShoppingBag />
                Add to Cart
              </button>
              <button className="btn btn-outline-secondary btn-lg shadow-sm px-4 d-flex align-items-center gap-2">
                <FiHeart />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AlarmClock;
