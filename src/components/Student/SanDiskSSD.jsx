import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const SanDiskSSD = () => {
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedInterface, setSelectedInterface] = useState("SATA");
  const [activeImage, setActiveImage] = useState(0); // Main image
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  const location = useLocation();
  const product = location.state || {
    id: 11,
    brand: "SanDisk",
    originalPrice: 2000,
    discountedPrice: 1800,
    rating: 4,
    discount: 10,
    name: "SSD",
    image: "./image/SD.webp",
    type: "SSD",
  };
  const { id } = useParams(); // Assuming route contains a product ID

  const getProductImages = () => {
    return [
      "/image/SD.webp", // Main image
      "/image/Student/ssd1 (1).jpg",
      "/image/Student/ssd1 (2).jpg",
      "/image/Student/ssd1 (3).jpg",
      "/image/Student/ssd1 (4).jpg",
    ];
  };

  const images = getProductImages();

  const interfaces = [
    { id: "SATA", name: "SATA III" },
    { id: "NVME", name: "NVMe PCIe Gen3x4" },
    { id: "NVME4", name: "NVMe PCIe Gen4" },
  ];

  const capacities = [
    { capacity: "250GB", price: 1800 },
    { capacity: "500GB", price: 3000 },
    { capacity: "1TB", price: 5500 },
    { capacity: "2TB", price: 9500 },
  ];

  const getCurrentPrice = () => {
    if (!selectedCapacity) return 0;
    const capacityOption = capacities.find(
      (c) => c.capacity === selectedCapacity
    );
    return capacityOption ? capacityOption.price * quantity : 0;
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
                  {selectedCapacity
                    ? `₹${getCurrentPrice().toLocaleString()}`
                    : "Select capacity for price"}
                </h2>
                {selectedCapacity && (
                  <p className="text-decoration-line-through text-muted mb-0">
                    ₹{(getCurrentPrice() * 1.1).toLocaleString()}
                  </p>
                )}
                {selectedCapacity && (
                  <span className="badge bg-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <p className="lead mb-4">
              {product.type} by {product.brand} - High-performance solid state
              drive for faster boot and load times
            </p>

            {/* Interface selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Select Interface:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {interfaces.map((interface_type) => (
                  <div
                    key={interface_type.id}
                    onClick={() => setSelectedInterface(interface_type.id)}
                    className={`border rounded-3 p-2 ${
                      selectedInterface === interface_type.id
                        ? "border-primary bg-primary bg-opacity-10"
                        : ""
                    }`}
                    style={{ cursor: "pointer", minWidth: "150px" }}
                  >
                    <div className="text-center">{interface_type.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity selector */}
            <div className="row mb-4">
              <div className="col-md-8">
                <label className="form-label fw-semibold">
                  Select Storage Capacity:
                </label>
                <select
                  className="form-select form-select-lg shadow-sm"
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                >
                  <option value="">Select Capacity</option>
                  {capacities.map((capacityOption) => (
                    <option
                      key={capacityOption.capacity}
                      value={capacityOption.capacity}
                    >
                      {capacityOption.capacity} - ₹{capacityOption.price}
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
                        <strong>Brand:</strong> SanDisk
                      </li>
                      <li className="mb-2">
                        <strong>Read Speed:</strong> Up to 550 MB/s
                      </li>
                      <li className="mb-2">
                        <strong>Write Speed:</strong> Up to 520 MB/s
                      </li>
                      <li className="mb-2">
                        <strong>Form Factor:</strong> 2.5 Inch
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>NAND Type:</strong> 3D TLC
                      </li>
                      <li className="mb-2">
                        <strong>MTBF:</strong> 1.75M Hours
                      </li>
                      <li className="mb-2">
                        <strong>Interface:</strong>{" "}
                        {selectedInterface === "SATA"
                          ? "SATA III 6Gb/s"
                          : "PCIe NVMe"}
                      </li>
                      <li className="mb-2">
                        <strong>Warranty:</strong> 5 Years Limited
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-semibold mt-4">About this item:</h5>
                <ul className="list-group list-group-flush bg-transparent">
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Sequential read speeds up to 550MB/s for faster boot and
                    load times.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Shock-resistant and vibration-resistant with no moving
                    parts.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Lower power consumption and cooler operation than
                    traditional hard drives.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • Dashboard software for monitoring drive health and
                    managing performance.
                  </li>
                  <li className="list-group-item bg-transparent border-0 px-0">
                    • 5-year manufacturer warranty for peace of mind.
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

export default SanDiskSSD;
