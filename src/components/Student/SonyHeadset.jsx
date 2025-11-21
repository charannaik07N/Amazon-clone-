import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const SonyHeadset = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const { id } = useParams();

  // Product object for Sony Headset
  const product = location.state || {
    id: 3,
    brand: "Sony",
    originalPrice: 25000,
    discountedPrice: 20000,
    rating: 5,
    discount: 5,
    name: "Headset",
    type: "Headset",
  };

  const getProductImages = () => {
    return [
      "/image/Sony.webp", // Main image
      "/image/Student/Soni1 (1).jpg",
      "/image/Student/Soni1 (2).jpg",
      "/image/Student/Soni1 (3).jpg",
      "/image/Student/Soni1 (4).jpg",
    ];
  };

  const images = getProductImages();

  const colors = [
    { id: "Black", value: "#000000", name: "Black" },
    { id: "Silver", value: "#C0C0C0", name: "Silver" },
    { id: "Blue", value: "#0000FF", name: "Blue" },
  ];

  const features = [
    { feature: "Noise Cancelling", price: 25000 },
    { feature: "Standard Edition", price: 20000 },
    { feature: "Gaming Edition", price: 22000 },
    { feature: "Pro Edition", price: 28000 },
  ];

  const getCurrentPrice = () => {
    if (!selectedFeature) return 0;
    const featureOption = features.find((f) => f.feature === selectedFeature);
    return featureOption ? featureOption.price * quantity : 0;
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
                  {selectedFeature
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select edition for price"}
                </h2>
                {selectedFeature && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(product.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {selectedFeature && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              {product.type} by {product.brand} - Premium audio experience with
              superior comfort
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
                      className="rounded-circle"
                      style={{
                        backgroundColor: color.value,
                        width: "30px",
                        height: "30px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
              <span className="small text-muted mt-1 d-block">
                Selected: {selectedColor}
              </span>
            </div>

            {/* Edition selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select Edition:
                </label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                >
                  <option value="">Select Edition</option>
                  {features.map((featureOption) => (
                    <option
                      key={featureOption.feature}
                      value={featureOption.feature}
                    >
                      {featureOption.feature}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specifications */}
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
                        <strong>Type:</strong> Over-Ear Headphones
                      </li>
                      <li className="mb-2">
                        <strong>Connection:</strong> Bluetooth 5.0
                      </li>
                      <li className="mb-2">
                        <strong>Battery Life:</strong> Up to 30 hours
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Driver Size:</strong> 40mm
                      </li>
                      <li className="mb-2">
                        <strong>Frequency Response:</strong> 4Hz-40,000Hz
                      </li>
                      <li className="mb-2">
                        <strong>Impedance:</strong> 47 ohm
                      </li>
                      <li className="mb-2">
                        <strong>Color:</strong> {selectedColor}
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Industry-leading noise cancellation technology for
                    immersive sound experience
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Premium comfort with soft ear cushions and adjustable
                    headband
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Touch sensor controls for easy music playback, calls, and
                    volume adjustment
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Quick charging with 5 hours of playback from just 10
                    minutes of charge
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • High-resolution audio for exceptional sound quality and
                    clarity
                  </li>
                </ul>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Quantity:</label>
                <input
                  type="number"
                  className="form-control form-control-lg shadow-sm"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-primary shadow-sm rounded-pill btn-lg px-4">
                <FiShoppingBag className="me-2" />
                Add to Cart
              </button>
              <button className="btn btn-outline-secondary shadow-sm rounded-pill btn-lg px-4">
                <FiHeart className="me-2" />
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

export default SonyHeadset;
