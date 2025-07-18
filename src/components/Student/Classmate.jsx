import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Classmate = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const { id } = useParams();

  // Product object for Classmate book
  const product = location.state || {
    id: 8,
    brand: "Classmate",
    originalPrice: 1000,
    discountedPrice: 800,
    rating: 5,
    discount: 20,
    name: "Books",
    type: "Books",
  };

  const getProductImages = () => {
    return [
      "/image/book1.webp", // Main image
      "/image/Student/book1 (1).jpg",
      "/image/Student/book1 (2).jpg",
      "/image/Student/book1 (3).jpg",
      "/image/Student/book1 (4).jpg",
    ];
  };

  const images = getProductImages();

  const sizes = [
    { size: "A4 Size - 120 pages", price: 800 },
    { size: "A4 Size - 180 pages", price: 1000 },
    { size: "A5 Size - 120 pages", price: 600 },
    { size: "A5 Size - 180 pages", price: 800 },
  ];

  const getCurrentPrice = () => {
    if (!selectedSize) return 0;
    const sizeOption = sizes.find((s) => s.size === selectedSize);
    return sizeOption ? sizeOption.price * quantity : 0;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 20) {
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
              {product.type} by {product.brand} - Perfect for school, college,
              and office use
            </p>

            {/* Improved sizing selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select Size and Pages:
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

            {/* Specifications */}
            <div className="card border-0 bg-light shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold">Specifications:</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Brand:</strong> Classmate
                      </li>
                      <li className="mb-2">
                        <strong>Type:</strong> Notebook
                      </li>
                      <li className="mb-2">
                        <strong>Cover:</strong> Hard Bound
                      </li>
                      <li className="mb-2">
                        <strong>Paper Quality:</strong> 70 GSM
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Ruling:</strong> Single Line
                      </li>
                      <li className="mb-2">
                        <strong>Binding:</strong> Sewn Binding
                      </li>
                      <li className="mb-2">
                        <strong>Feature:</strong> Long Lasting
                      </li>
                      <li className="mb-2">
                        <strong>Color:</strong> Assorted Colors
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Premium quality paper that prevents ink bleeding and
                    feathering.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Environmentally friendly - made from sustainable paper
                    sources.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Durable binding ensures pages stay intact even with
                    regular use.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Attractive cover designs to inspire creativity and
                    learning.
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
                  max="20"
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

export default Classmate;
