import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const pressureCookers = [
  {
    id: 1,
    brand: "Pigeon",
    type: "Pressure Cooker",
    material: "Stainless Steel",
    capacity: "0-2L",
    lidType: "Inner",
    price: 800,
    discount: 10,
    rating: 4.5,
    name: "Pigeon Stainless Steel Cooker",
    image: "./image/cooker1.jpg",
  },
  {
    id: 2,
    brand: "Bajaj",
    type: "Pressure Cooker & Pressure Pan",
    material: "Aluminium",
    capacity: "2.1-4L",
    lidType: "Outer",
    price: 1200,
    discount: 15,
    rating: 4.2,
    name: "Bajaj Aluminium Cooker",
    image: "./image/cooker2.jpg",
  },
  {
    id: 3,
    brand: "Prestige",
    type: "Pressure Pan",
    material: "Brass",
    capacity: "5L Above",
    lidType: "Inner",
    price: 2200,
    discount: 20,
    rating: 4.8,
    name: "Prestige Brass Pan",
    image: "./image/cooker3.jpg",
  },
  {
    id: 4,
    brand: "Butterfly",
    type: "Pressure Cooker",
    material: "Stainless Steel",
    capacity: "2.1-4L",
    lidType: "Outer",
    price: 1800,
    discount: 25,
    rating: 4.6,
    name: "Butterfly Steel Cooker",
    image: "./image/cooker4.jpg",
  },
  {
    id: 5,
    brand: "Greenchef",
    type: "Pressure Cooker",
    material: "Aluminium",
    capacity: "0-2L",
    lidType: "Inner",
    price: 600,
    discount: 5,
    rating: 3.9,
    name: "Greenchef Aluminium Cooker",
    image: "./image/cooker5.jpg",
  },
  {
    id: 6,
    brand: "Pigeon",
    type: "Pressure Pan",
    material: "Aluminium",
    capacity: "5L Above",
    lidType: "Outer",
    price: 1600,
    discount: 18,
    rating: 4.4,
    name: "Pigeon Aluminium Pan",
    image: "./image/cooker7.jpg",
  },
  {
    id: 7,
    brand: "Bajaj",
    type: "Pressure Cooker",
    material: "Stainless Steel",
    capacity: "0-2L",
    lidType: "Inner",
    price: 1000,
    discount: 12,
    rating: 4.3,
    name: "Bajaj Steel Cooker",
    image: "./image/cooker6.jpg",
  },
  {
    id: 8,
    brand: "Prestige",
    type: "Pressure Cooker & Pressure Pan",
    material: "Aluminium",
    capacity: "2.1-4L",
    lidType: "Outer",
    price: 2000,
    discount: 15,
    rating: 4.7,
    name: "Prestige Aluminium Cooker",
    image: "./image/cooker8.jpg",
  },
  {
    id: 9,
    brand: "Butterfly",
    type: "Pressure Pan",
    material: "Brass",
    capacity: "5L Above",
    lidType: "Inner",
    price: 2500,
    discount: 20,
    rating: 4.9,
    name: "Butterfly Brass Pan",
    image: "./image/cooker9.jpg",
  },
  {
    id: 10,
    brand: "Greenchef",
    type: "Pressure Cooker & Pressure Pan",
    material: "Stainless Steel",
    capacity: "2.1-4L",
    lidType: "Outer",
    price: 1400,
    discount: 8,
    rating: 4.0,
    name: "Greenchef Steel Cooker",
    image: "./image/cooker10.jpg",
  },
  {
    id: 11,
    brand: "Pigeon",
    type: "Pressure Cooker",
    material: "Brass",
    capacity: "2.1-4L",
    lidType: "Outer",
    price: 1900,
    discount: 22,
    rating: 4.5,
    name: "Pigeon Brass Cooker",
    image: "./image/cooker11.jpg",
  },
  {
    id: 12,
    brand: "Bajaj",
    type: "Pressure Pan",
    material: "Stainless Steel",
    capacity: "5L Above",
    lidType: "Inner",
    price: 2100,
    discount: 10,
    rating: 4.4,
    name: "Bajaj Steel Pan",
    image: "./image/cooker12.jpg",
  },
];

function PressureCooker() {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedCapacity, setSelectedCapacity] = useState([]);
  const [selectedLidType, setSelectedLidType] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [discount, setDiscount] = useState(null);

  // Handler functions remain the same
  const handleBrandChange = (brand) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brand)
        ? prevSelected.filter((b) => b !== brand)
        : [...prevSelected, brand]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedType((prevSelected) =>
      prevSelected.includes(type)
        ? prevSelected.filter((t) => t !== type)
        : [...prevSelected, type]
    );
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial((prevSelected) =>
      prevSelected.includes(material)
        ? prevSelected.filter((m) => m !== material)
        : [...prevSelected, material]
    );
  };

  const handleCapacityChange = (capacity) => {
    setSelectedCapacity((prevSelected) =>
      prevSelected.includes(capacity)
        ? prevSelected.filter((c) => c !== capacity)
        : [...prevSelected, capacity]
    );
  };

  const filteredPressureCookers = pressureCookers.filter((cooker) => {
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(cooker.brand);
    const matchesType =
      selectedType.length === 0 || selectedType.includes(cooker.type);
    const matchesMaterial =
      selectedMaterial.length === 0 ||
      selectedMaterial.includes(cooker.material);
    const matchesCapacity =
      selectedCapacity.length === 0 ||
      selectedCapacity.includes(cooker.capacity);
    const matchesLidType =
      selectedLidType === null || cooker.lidType === selectedLidType;
    const matchesPrice =
      priceRange === null ||
      (priceRange === "1-500" && cooker.price <= 500) ||
      (priceRange === "501-1000" &&
        cooker.price > 500 &&
        cooker.price <= 1000) ||
      (priceRange === "1001-2000" &&
        cooker.price > 1000 &&
        cooker.price <= 2000) ||
      (priceRange === "above2000" && cooker.price > 2000);
    const matchesDiscount = discount === null || cooker.discount >= discount;

    return (
      matchesBrand &&
      matchesType &&
      matchesMaterial &&
      matchesCapacity &&
      matchesLidType &&
      matchesPrice &&
      matchesDiscount
    );
  });

  const renderFilterSection = (
    title,
    items,
    selectedItems,
    handleChange,
    type = "checkbox"
  ) => (
    <div className="card mb-3 border-0 shadow-sm">
      <div className="card-header bg-light">
        <h6 className="mb-0 fw-bold text-secondary">{title}</h6>
      </div>
      <div className="card-body">
        {items.map((item) => (
          <div key={item} className="form-check mb-2">
            <input
              className="form-check-input"
              type={type}
              name={title.toLowerCase()}
              id={`${title}-${item}`}
              checked={
                type === "radio"
                  ? selectedItems === item
                  : selectedItems.includes(item)
              }
              onChange={() => handleChange(item)}
            />
            <label className="form-check-label" htmlFor={`${title}-${item}`}>
              {type === "radio" && title === "Discount"
                ? `${item}% or more`
                : type === "radio" && title === "Price"
                ? item.replace("above2000", "Above 2000")
                : item}
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
              <h2 className="display-6 mb-0">Pressure Cookers</h2>
              <p className="text-muted">
                Find the perfect pressure cooker for your kitchen
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Filters Column */}
            <div className="col-lg-3">
              <div className="sticky-top" style={{ top: "20px" }}>
                <div className="bg-white rounded-3 p-3 shadow-sm">
                  <h5 className="mb-4 text-primary">Filters</h5>
                  {renderFilterSection(
                    "Brand",
                    ["Pigeon", "Bajaj", "Prestige", "Butterfly", "Greenchef"],
                    selectedBrands,
                    handleBrandChange
                  )}
                  {renderFilterSection(
                    "Type",
                    [
                      "Pressure Cooker",
                      "Pressure Cooker & Pressure Pan",
                      "Pressure Pan",
                    ],
                    selectedType,
                    handleTypeChange
                  )}
                  {renderFilterSection(
                    "Material",
                    ["Stainless Steel", "Aluminium", "Brass"],
                    selectedMaterial,
                    handleMaterialChange
                  )}
                  {renderFilterSection(
                    "Capacity",
                    ["0-2L", "2.1-4L", "5L Above"],
                    selectedCapacity,
                    handleCapacityChange
                  )}
                  {renderFilterSection(
                    "Lid Type",
                    ["Inner", "Outer"],
                    selectedLidType,
                    setSelectedLidType,
                    "radio"
                  )}
                  {renderFilterSection(
                    "Price",
                    ["1-500", "501-1000", "1001-2000", "above2000"],
                    priceRange,
                    setPriceRange,
                    "radio"
                  )}
                  {renderFilterSection(
                    "Discount",
                    [5, 10, 15, 20, 25],
                    discount,
                    setDiscount,
                    "radio"
                  )}
                </div>
              </div>
            </div>

            {/* Products Column */}
            <div className="col-lg-9">
              <div className="row g-4">
                {filteredPressureCookers.length > 0 ? (
                  filteredPressureCookers.map((cooker) => (
                    <div key={cooker.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                        <div className="position-relative">
                          <img
                            src={cooker.image}
                            className="card-img-top"
                            alt={cooker.name}
                            style={{ height: "200px", objectFit: "contain" }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-danger">
                              {cooker.discount}% OFF
                            </span>
                          </div>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title text-truncate mb-3">
                            {cooker.name}
                          </h5>
                          <div className="small text-muted mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Type:</span>
                              <span className="fw-medium">{cooker.type}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Material:</span>
                              <span className="fw-medium">
                                {cooker.material}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Capacity:</span>
                              <span className="fw-medium">
                                {cooker.capacity}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Lid Type:</span>
                              <span className="badge bg-secondary">
                                {cooker.lidType}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <div>
                              <span className="h5 text-primary mb-0">
                                ₹{cooker.price}
                              </span>
                              <div className="d-flex align-items-center mt-1">
                                <span className="text-warning me-1">★</span>
                                <span className="small fw-bold">
                                  {cooker.rating}
                                </span>
                              </div>
                            </div>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => {
                                // Create product object for cart
                                const cartItem = {
                                  productId: `cooker_${cooker.id}`,
                                  name: cooker.name,
                                  price: cooker.price,
                                  quantity: 1,
                                  image: cooker.image,
                                  category: "Pressure Cooker",
                                  brand: cooker.brand,
                                  type: cooker.type,
                                  material: cooker.material,
                                  capacity: cooker.capacity,
                                  lidType: cooker.lidType,
                                };

                                // Dispatch custom event for cart update
                                const event = new CustomEvent("cartUpdate", {
                                  detail: { product: cartItem, action: "add" },
                                });
                                window.dispatchEvent(event);

                                // Show success message
                                alert(`Added ${cooker.name} to cart!`);
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="alert alert-info text-center" role="alert">
                      <i className="bi bi-info-circle me-2"></i>
                      No pressure cookers match your selected filters. Try
                      adjusting your criteria.
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

export default PressureCooker;
