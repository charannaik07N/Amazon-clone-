import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const products = [
  {
    id: 1,
    brand: "Bajaj",
    name: "Bajaj Classic 750W Mixer Grinder",
    price: 2599,
    originalPrice: 3499,
    discount: 25,
    rating: 4.3,
    type: "Mixer Grinder",
    theme: "Nutri Blender",
    power: "750W",
    features: ["3 Jars", "High-Speed Motor", "Overload Protection"],
    image: "./image/mix1.jpg",
  },
  {
    id: 2,
    brand: "Philips",
    name: "Philips Viva Collection Juicer Mixer Grinder",
    price: 3799,
    originalPrice: 4999,
    discount: 24,
    rating: 4.5,
    type: "Juicer Mixer Grinder",
    theme: "Cold Press Technology",
    power: "More than 1000W",
    features: ["4 Jars", "Cold Press Juicing", "Easy to Clean"],
    image: "./image/mix2.jpg",
  },
  {
    id: 3,
    brand: "Prestige",
    name: "Prestige Deluxe Juicer Mixer",
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    rating: 4.0,
    type: "Juicer",
    theme: "Premium Range",
    power: "300W-500W",
    features: ["Compact Design", "Stainless Steel Blades", "1 Jar"],
    image: "./image/mix3.jpg",
  },
  {
    id: 4,
    brand: "Butterfly",
    name: "Butterfly Rapid 750W Mixer Grinder",
    price: 2299,
    originalPrice: 3299,
    discount: 30,
    rating: 4.2,
    type: "Mixer Grinder",
    theme: "Nutri Blender",
    power: "750W",
    features: ["3 Jars", "High-Speed Motor", "Overload Protection"],
    image: "./image/mix4.jpg",
  },
  {
    id: 5,
    brand: "Preethi",
    name: "Preethi Zodiac 1000W Juicer Mixer Grinder",
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    rating: 4.7,
    type: "Juicer Mixer Grinder",
    theme: "Cold Press Technology",
    power: "More than 1000W",
    features: ["5 Jars", "Cold Press Juicing", "Multipurpose Juicer"],
    image: "./image/mix5.jpg",
  },
  {
    id: 6,
    brand: "Philips",
    name: "Philips Essence 500W Juicer Mixer",
    price: 2799,
    originalPrice: 3999,
    discount: 30,
    rating: 4.4,
    type: "Juicer Mixer Grinder",
    theme: "Premium Range",
    power: "300W-500W",
    features: ["3 Jars", "Compact Design", "Easy to Clean"],
    image: "./image/mix6.jpg",
  },
  {
    id: 7,
    brand: "Crompton",
    name: "Crompton Nutri Mix 750W Mixer Grinder",
    price: 2599,
    originalPrice: 3499,
    discount: 25,
    rating: 4.3,
    type: "Mixer Grinder",
    theme: "Nutri Blender",
    power: "750W",
    features: ["3 Jars", "Overload Protection", "High-Speed Motor"],
    image: "./image/mix7.jpg",
  },
  {
    id: 8,
    brand: "Prestige",
    name: "Prestige Power 500W Juicer",
    price: 2199,
    originalPrice: 2999,
    discount: 27,
    rating: 4.1,
    type: "Juicer",
    theme: "Premium Range",
    power: "300W-500W",
    features: ["1 Jar", "Stainless Steel Blades", "Compact Design"],
    image: "./image/mix8.jpg",
  },
  {
    id: 9,
    brand: "Usha",
    name: "Usha Cold Press 1000W Juicer Mixer Grinder",
    price: 4899,
    originalPrice: 6799,
    discount: 28,
    rating: 4.6,
    type: "Juicer Mixer Grinder",
    theme: "Cold Press Technology",
    power: "More than 1000W",
    features: ["4 Jars", "Cold Press Juicing", "Easy to Use"],
    image: "./image/mix9.jpg",
  },
  {
    id: 10,
    brand: "Bajaj",
    name: "Bajaj Super 500W Juicer Mixer",
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    rating: 4.2,
    type: "Juicer Mixer Grinder",
    theme: "Premium Range",
    power: "300W-500W",
    features: ["2 Jars", "Compact Design", "Stainless Steel Blades"],
    image: "./image/mix10.jpg",
  },
];

function Mixer() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(null);
  const [type, setType] = useState([]);
  const [theme, setTheme] = useState([]);
  const [power, setPower] = useState([]);
  const [discount, setDiscount] = useState(null);
  const [rating, setRating] = useState(null);

  // Handler functions remain the same
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleTypeChange = (selectedType) => {
    setType((prev) =>
      prev.includes(selectedType)
        ? prev.filter((t) => t !== selectedType)
        : [...prev, selectedType]
    );
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme((prev) =>
      prev.includes(selectedTheme)
        ? prev.filter((t) => t !== selectedTheme)
        : [...prev, selectedTheme]
    );
  };

  const handlePowerChange = (selectedPower) => {
    setPower((prev) =>
      prev.includes(selectedPower)
        ? prev.filter((p) => p !== selectedPower)
        : [...prev, selectedPower]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesBrand =
      !selectedBrands.length || selectedBrands.includes(product.brand);
    const matchesPrice =
      !priceRange ||
      (priceRange === "1000-2000" &&
        product.price >= 1000 &&
        product.price <= 2000) ||
      (priceRange === "2001-3000" &&
        product.price > 2000 &&
        product.price <= 3000) ||
      (priceRange === "3001-4000" &&
        product.price > 3000 &&
        product.price <= 4000) ||
      (priceRange === "above 5000" && product.price > 5000);
    const matchesType = !type.length || type.includes(product.type);
    const matchesTheme = !theme.length || theme.includes(product.theme);
    const matchesPower = !power.length || power.includes(product.power);
    const matchesDiscount = !discount || product.discount >= parseInt(discount);
    const matchesRating = !rating || product.rating >= parseFloat(rating);

    return (
      matchesBrand &&
      matchesPrice &&
      matchesType &&
      matchesTheme &&
      matchesPower &&
      matchesDiscount &&
      matchesRating
    );
  });

  const renderFilterSection = (
    title,
    items,
    selectedItems,
    handleChange,
    inputType = "checkbox",
    valueFormatter
  ) => (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-light border-0">
        <h6 className="mb-0 fw-semibold text-secondary">{title}</h6>
      </div>
      <div className="card-body">
        {items.map((item) => (
          <div key={item} className="form-check mb-2">
            <input
              className="form-check-input"
              type={inputType}
              name={title.toLowerCase()}
              id={`${title}-${item}`}
              checked={
                inputType === "radio"
                  ? selectedItems === item
                  : selectedItems.includes(item)
              }
              onChange={() => handleChange(item)}
            />
            <label className="form-check-label" htmlFor={`${title}-${item}`}>
              {valueFormatter ? valueFormatter(item) : item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col">
              <h2 className="display-6 mb-0">Mixer Grinders</h2>
              <p className="text-muted">
                Find the perfect mixer grinder for your kitchen
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Filters Column */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: "20px" }}>
                <div className="bg-white rounded-3 p-3 shadow">
                  <h5 className="mb-4 text-primary">Filters</h5>
                  {renderFilterSection(
                    "Brand",
                    [
                      "Bajaj",
                      "Butterfly",
                      "Prestige",
                      "Philips",
                      "Crompton",
                      "Preethi",
                      "Usha",
                    ],
                    selectedBrands,
                    handleBrandChange
                  )}
                  {renderFilterSection(
                    "Price Range",
                    ["1000-2000", "2001-3000", "3001-4000", "above 5000"],
                    priceRange,
                    setPriceRange,
                    "radio"
                  )}
                  {renderFilterSection(
                    "Type",
                    ["Mixer Grinder", "Juicer Mixer Grinder", "Juicer"],
                    type,
                    handleTypeChange
                  )}
                  {renderFilterSection(
                    "Theme",
                    ["Nutri Blender", "Cold Press Technology", "Premium Range"],
                    theme,
                    handleThemeChange
                  )}
                  {renderFilterSection(
                    "Power",
                    ["More than 1000W", "300W-500W", "750W"],
                    power,
                    handlePowerChange
                  )}
                  {renderFilterSection(
                    "Discount",
                    ["10", "20", "30", "40", "50"],
                    discount,
                    setDiscount,
                    "radio",
                    (d) => `Above ${d}%`
                  )}
                  {renderFilterSection(
                    "Rating",
                    ["3", "4", "4.5", "5"],
                    rating,
                    setRating,
                    "radio",
                    (r) => `${r}★ & above`
                  )}
                </div>
              </div>
            </div>

            {/* Products Column */}
            <div className="col-lg-9">
              <div className="row g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="col-12">
                      <div className="card border-0 shadow-sm hover-shadow">
                        <div className="row g-0">
                          <div className="col-md-4 p-3">
                            <img
                              src={product.image}
                              className="img-fluid rounded"
                              alt={product.name}
                              style={{
                                objectFit: "contain",
                                // height: "100%",
                                // width: "100%",
                              }}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="card-title mb-0">
                                  {product.name}
                                </h5>
                                <span className="badge bg-success">
                                  {product.discount}% OFF
                                </span>
                              </div>
                              <div className="mb-3">
                                <span className="h4 text-primary me-2">
                                  ₹{product.price}
                                </span>
                                <span className="text-muted text-decoration-line-through">
                                  ₹{product.originalPrice}
                                </span>
                              </div>
                              <div className="d-flex align-items-center mb-3">
                                <span className="badge bg-warning text-dark me-2">
                                  {product.rating} ★
                                </span>
                                <span className="badge bg-secondary me-2">
                                  {product.type}
                                </span>
                                <span className="badge bg-info text-dark">
                                  {product.power}
                                </span>
                              </div>
                              <div className="mb-3">
                                <h6 className="mb-2">Key Features:</h6>
                                <ul className="list-unstyled">
                                  {product.features.map((feature, index) => (
                                    <li key={index} className="mb-1">
                                      <i className="bi bi-check2 text-success me-2"></i>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-outline-primary me-2"
                                  onClick={() => {
                                    // Create product object for cart
                                    const cartItem = {
                                      productId: `mixer_${product.id}`,
                                      name: product.name,
                                      price: product.price,
                                      quantity: 1,
                                      image: product.image,
                                      category: "Mixer Grinder",
                                      brand: product.brand,
                                      type: product.type,
                                      theme: product.theme,
                                      power: product.power,
                                      features: product.features,
                                    };

                                    // Dispatch custom event for cart update
                                    const event = new CustomEvent(
                                      "cartUpdate",
                                      {
                                        detail: {
                                          product: cartItem,
                                          action: "add",
                                        },
                                      }
                                    );
                                    window.dispatchEvent(event);

                                    // Show success message
                                    alert(`Added ${product.name} to cart!`);
                                  }}
                                >
                                  Add to Cart
                                </button>
                                <button className="btn btn-primary">
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="alert alert-info text-center" role="alert">
                      <i className="bi bi-info-circle me-2"></i>
                      No products match your selected filters. Try adjusting
                      your criteria.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Mixer;
