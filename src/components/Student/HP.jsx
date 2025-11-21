import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const HP = () => {
  const [selectedColor, setSelectedColor] = useState("navy");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state; // Assuming product is passed via location.state
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/hp.webp", // Main image
      "/image/Student/HP1 (1).jpg",
      "/image/Student/HP1 (2).jpg",
      "/image/Student/HP1 (3).jpg",
      "/image/Student/HP1 (4).jpg",
    ];
  };

  const images = getProductImages();

  const colors = [
    { id: "navy", value: "#000080", name: "Navy Blue" },
    { id: "grey", value: "#808080", name: "Classic Grey" },
    { id: "black", value: "#000000", name: "Classic Black" },
  ];

  const sizes = [
    { size: "8GB RAM + 512GB SSD", price: 45000 },
    { size: "8GB RAM + 256GB SSD", price: 43000 },
    { size: "16GB RAM + 1TB SSD", price: 50000 },
  ];

  const getCurrentPrice = () => {
    if (!selectedSize) return 0;
    const sizeOption = sizes.find((s) => s.size === selectedSize);
    return sizeOption ? sizeOption.price * quantity : 0;
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

          {/* Right Column - Product Details - Removed overflow and maxHeight */}
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
                  {selectedSize
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select size for price"}
                </h2>
                {selectedSize && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(product.originalPrice * quantity).toLocaleString()}
                  </p>
                )}
                {selectedSize && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              {product.type} by {product.brand} - Perfect for any occasion
            </p>

            {/* Improved sizing selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select RAM and Storage:
                </label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Select Size</option>
                  {sizes.map((sizeOption) => (
                    <option key={sizeOption.size} value={sizeOption.size}>
                      {sizeOption.size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Improved specifications card */}
            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold">Specifications:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Model Name:</strong> HP Pavilion
                      </li>
                      <li className="mb-2">
                        <strong>Screen Size:</strong> 15.6 inches
                      </li>
                      <li className="mb-2">
                        <strong>Color:</strong> R5 7530U + 8GB/512GB
                      </li>
                      <li className="mb-2">
                        <strong>Hard Disk Size:</strong> 512GB
                      </li>
                      <li className="mb-2">
                        <strong>CPU Model:</strong> Ryzen 5
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>RAM:</strong> 8GB
                      </li>
                      <li className="mb-2">
                        <strong>Operating System:</strong> Windows 11 Home
                      </li>
                      <li className="mb-2">
                        <strong>Distinctive Feature:</strong> Anti Glare Screen
                      </li>
                      <li className="mb-2">
                        <strong>Graphics Card:</strong> Integrated Graphics
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Powerful Ryzen 5 processor for seamless multitasking.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Stunning 15.6-inch display with anti-glare technology.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Lightweight design, perfect for on-the-go productivity.
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

export default HP;
