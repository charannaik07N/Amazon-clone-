import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Sony2 = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [selectedModel, setSelectedModel] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 9,
    brand: "Sony",
    originalPrice: 20000,
    discountedPrice: 15000,
    rating: 4,
    discount: 37,
    name: "Headset",
    image: "./image/sony2.webp",
    type: "Headset",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/sony2.webp", // Main image
      "/image/Student/Soni2 (1).jpg",
      "/image/Student/Soni2 (1).jpg",
      "/image/Student/Soni2 (1).jpg",
      "/image/Student/Soni2 (1).jpg",
    ];
  };

  const images = getProductImages();

  const colors = [
    { id: "black", value: "#000000", name: "Midnight Black" },
    { id: "white", value: "#FFFFFF", name: "Platinum White" },
    { id: "blue", value: "#1E90FF", name: "Ocean Blue" },
  ];

  const models = [
    { model: "WH-1000XM4", price: 15000 },
    { model: "WH-1000XM5", price: 20000 },
    { model: "WH-CH720N", price: 12000 },
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
              {product.type} by {product.brand} - Premium audio experience with
              industry-leading noise cancellation
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
                        <strong>Brand:</strong> Sony
                      </li>
                      <li className="mb-2">
                        <strong>Connectivity:</strong> Bluetooth 5.2
                      </li>
                      <li className="mb-2">
                        <strong>Battery Life:</strong> Up to 30 hours
                      </li>
                      <li className="mb-2">
                        <strong>Noise Cancellation:</strong> Active (ANC)
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Driver Size:</strong> 40mm
                      </li>
                      <li className="mb-2">
                        <strong>Weight:</strong> 254g
                      </li>
                      <li className="mb-2">
                        <strong>Charging Port:</strong> USB-C
                      </li>
                      <li className="mb-2">
                        <strong>Charging Time:</strong> 3 hours
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Industry-leading noise cancellation with Dual Noise Sensor
                    technology.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Premium sound quality with Edge-AI and DSEE Extreme
                    upscaling.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Multipoint connection allows pairing with two Bluetooth
                    devices simultaneously.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Speak-to-chat technology automatically pauses music when
                    you start speaking.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Adaptive Sound Control adjusts ambient sound settings
                    based on your environment.
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

export default Sony2;
