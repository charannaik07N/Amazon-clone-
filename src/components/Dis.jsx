import React from "react";
import { useNavigate } from "react-router-dom";

const Dis = () => {
  const navigate = useNavigate();

  const handleImageClick = (id) => {
    navigate(`/${id}`);
  };

  const handleExploreClick = () => {
    navigate("/explore");
  };

  // Common card component to reduce repetition
  const ProductCard = ({ id, image, title, offer }) => (
    <div
      className="card h-100 shadow-sm border-0 rounded-3 product-card"
      onClick={() => handleImageClick(id)}
      style={{
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 .5rem 1rem rgba(0,0,0,.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
      }}
    >
      <div className="ratio ratio-1x1">
        <img
          src={image}
          className="card-img-top p-3"
          alt={title}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="card-body text-center p-3">
        <h6 className="card-title fw-semibold mb-2">{title}</h6>
        <p className="text-success mb-0 fw-medium">{offer}</p>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          {/* Sports and Fitness Section */}
          <div className="col-md-4">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 pb-2 border-bottom">
                Sports and Fitness
              </h5>
              <div className="row g-3">
                <div className="col-6">
                  <ProductCard
                    id="Cycle"
                    image="/image/cycle.jpg"
                    title="Cycle"
                    offer="Min. 50% Off"
                  />
                </div>
                <div className="col-6">
                  <ProductCard
                    id="Bank"
                    image="/image/power.webp"
                    title="power bank"
                    offer="Up to 50% Off"
                  />
                </div>
                <div className="col-6">
                  <ProductCard
                    id="Lights"
                    image="/image/lamp.jpg"
                    title="Study lamp"
                    offer="Min. 50% Off"
                  />
                </div>
                <div className="col-6">
                  <ProductCard
                    id="Tshirt"
                    image="/image/Tshirt.jpg"
                    title="Sport T-shirt"
                    offer="Min. 40% Off"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Home Stylish Section */}
          <div className="col-md-4">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 pb-2 border-bottom">
                Make Your Home Stylish
              </h5>
              <div className="row g-3">
                <div className="col-6">
                  <ProductCard
                    id="WaterBottle"
                    image="/image/Bottle.jpg"
                    title="Water Bottles & Flasks"
                    offer="In Focus Now"
                  />
                </div>
                <div className="col-6">
                  <ProductCard
                    id="Stand"
                    image="/image/stand.jpg"
                    title="Laptop Stand & Table "
                    offer="Special Offer"
                  />
                </div>
                <div className="col-6">
                  <ProductCard
                    id="Cool"
                    image="/image/cooling.jpg"
                    title="Cooling Pads"
                    offer="Special Offer"
                  />
                </div>
                <div className="col-6">
                  <ProductCard
                    id="PressureCooker"
                    image="/image/cooker.jpg"
                    title="Pressure Cookers"
                    offer="Special Offer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Section */}
          <div className="col-md-4">
            <div className="position-relative h-100 rounded-4 shadow-sm overflow-hidden">
              <img
                src="/image/mixer.avif"
                className="img-fluid w-100 h-100"
                alt="Top Selling Smartphones"
                style={{ objectFit: "cover" }}
              />
              <div
                className="position-absolute w-100 h-100 top-0 start-0"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)",
                }}
              />
              <div className="position-absolute start-50 bottom-0 translate-middle-x p-4 text-center w-100">
                <button
                  onClick={handleExploreClick}
                  className="btn btn-warning btn-lg px-4 py-2 fw-semibold rounded-pill shadow-sm"
                  style={{
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dis;
