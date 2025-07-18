import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const LogitechMouse = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 15,
    brand: "Logitech",
    originalPrice: 2000,
    discountedPrice: 1800,
    rating: 5,
    discount: 10,
    name: "Mouse",
    image: "./image/Mouse.webp",
    type: "Mouse",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/Mouse.webp", // Main image
      "/image/Student/Mouse1 (1).jpg",
      "/image/Student/Mouse1 (2).jpg",
      "/image/Student/Mouse1 (3).jpg",
      "/image/Student/Mouse1 (4).jpg",
    ];
  };

  const images = getProductImages();

  const colorOptions = [
    { id: "Black", name: "Carbon Black" },
    { id: "White", name: "Arctic White" },
    { id: "Grey", name: "Graphite Grey" },
  ];

  const modelOptions = [
    { model: "G102 Wired", price: 1800 },
    { model: "G304 Wireless", price: 2200 },
    { model: "G502 Hero Gaming", price: 2500 },
    { model: "MX Master 3", price: 3200 },
  ];

  const getCurrentPrice = () => {
    if (!selectedModel) return 0;
    const modelOption = modelOptions.find((m) => m.model === selectedModel);
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
                    ₹{Math.round(getCurrentPrice() * 1.1).toLocaleString()}
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
              {product.type} by {product.brand} - High precision, ergonomic
              design with customizable buttons for productivity and gaming
            </p>

            {/* Color selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Color:</label>
              <div className="d-flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`border rounded-3 p-2 ${
                      selectedColor === color.id
                        ? "border-primary bg-primary bg-opacity-10"
                        : ""
                    }`}
                    style={{ cursor: "pointer", minWidth: "150px" }}
                  >
                    <div className="text-center">{color.name}</div>
                  </div>
                ))}
              </div>
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
                  {modelOptions.map((modelOption) => (
                    <option key={modelOption.model} value={modelOption.model}>
                      {modelOption.model} - ₹{modelOption.price}
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
                        <strong>Brand:</strong> Logitech
                      </li>
                      <li className="mb-2">
                        <strong>Connection:</strong> Wired/Wireless (model
                        dependent)
                      </li>
                      <li className="mb-2">
                        <strong>DPI:</strong> Up to 16,000
                      </li>
                      <li className="mb-2">
                        <strong>Buttons:</strong> 6-11 (model dependent)
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Sensor:</strong> HERO 25K
                      </li>
                      <li className="mb-2">
                        <strong>Battery Life:</strong> Up to 240 hours (wireless
                        models)
                      </li>
                      <li className="mb-2">
                        <strong>Color:</strong> {selectedColor}
                      </li>
                      <li className="mb-2">
                        <strong>Warranty:</strong> 2 Years
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • HERO 25K sensor provides precision tracking with zero
                    smoothing, filtering, or acceleration.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Programmable buttons with Logitech G HUB software for
                    custom macros and commands.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Lightsync RGB technology for customizable lighting that
                    syncs with your content.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Ergonomic design for comfortable use during extended
                    gaming or work sessions.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Onboard memory allows you to save your settings directly
                    to the mouse.
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

export default LogitechMouse;
