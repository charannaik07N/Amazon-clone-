import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const NikeWaterBottle = () => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("Stainless Steel");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 13,
    brand: "Nike",
    originalPrice: 500,
    discountedPrice: 450,
    rating: 4,
    discount: 10,
    name: "Water Bottle",
    image: "./image/bottle.webp",
    type: "Water Bottle",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/bottle.webp", // Main image
    //   "/image/Student/bottle1.jpg",
    //   "/image/Student/bottle2.jpg",
    //   "/image/Student/bottle3.jpg",
    //   "/image/Student/bottle4.jpg",
    ];
  };

  const images = getProductImages();

  const materialOptions = [
    { id: "Stainless Steel", name: "Stainless Steel" },
    { id: "Plastic", name: "BPA-Free Plastic" },
    { id: "Glass", name: "Premium Glass" },
  ];

  const sizeOptions = [
    { size: "350ml", price: 450 },
    { size: "500ml", price: 500 },
    { size: "750ml", price: 550 },
    { size: "1L", price: 600 },
  ];

  const getCurrentPrice = () => {
    if (!selectedSize) return 0;
    const sizeOption = sizeOptions.find((s) => s.size === selectedSize);
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
                    ₹{Math.round(getCurrentPrice() * 1.1).toLocaleString()}
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
              {product.type} by {product.brand} - Premium hydration solution
              with double-wall insulation to keep drinks at the ideal
              temperature
            </p>

            {/* Material selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Material:</label>
              <div className="d-flex flex-wrap gap-2">
                {materialOptions.map((material) => (
                  <div
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`border rounded-3 p-2 ${
                      selectedMaterial === material.id
                        ? "border-primary bg-primary bg-opacity-10"
                        : ""
                    }`}
                    style={{ cursor: "pointer", minWidth: "150px" }}
                  >
                    <div className="text-center">{material.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">Select Size:</label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map((sizeOption) => (
                    <option key={sizeOption.size} value={sizeOption.size}>
                      {sizeOption.size} - ₹{sizeOption.price}
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
                        <strong>Brand:</strong> Nike
                      </li>
                      <li className="mb-2">
                        <strong>Insulation:</strong> Double Wall
                      </li>
                      <li className="mb-2">
                        <strong>Cold Retention:</strong> Up to 24 hours
                      </li>
                      <li className="mb-2">
                        <strong>Hot Retention:</strong> Up to 12 hours
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Cap Type:</strong> Leak-proof
                      </li>
                      <li className="mb-2">
                        <strong>Material:</strong> {selectedMaterial}
                      </li>
                      <li className="mb-2">
                        <strong>Mouth Width:</strong> Standard
                      </li>
                      <li className="mb-2">
                        <strong>Warranty:</strong> 1 Year
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Double-wall vacuum insulation keeps beverages cold for up
                    to 24 hours or hot for up to 12 hours.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Leak-proof design with secure twist cap ensures no spills
                    during transport.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Sweat-free exterior prevents condensation and water rings
                    on surfaces.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Wide mouth opening for easy filling, adding ice, and
                    cleaning.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Durable construction with Nike branding and premium
                    finish.
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

export default NikeWaterBottle;
