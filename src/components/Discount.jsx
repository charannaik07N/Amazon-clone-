import React from "react";
import { useNavigate } from "react-router-dom";

const Discount = () => {
  const navigate = useNavigate();

  const handleImageClick = (id) => {
    navigate(`/${id}`);
  };

  const handleExploreNowClick = () => {
    navigate("/explorenow");
  };

  return (
    <div className="container py-4">
      <div className="row gy-4">
        {/* Left section: Winter Essentials */}
        <div className="col-md-4">
          <div className="bg-white p-3 rounded-3 h-100">
            <h5 className="fw-bold mb-3">Winter Essentials for You</h5>
            <div className="row g-3">
              {/* True Wireless */}
              <div className="col-6">
                <div
                  className="card h-100"
                  onClick={() => handleImageClick("Allearbuds")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ratio ratio-1x1">
                    <img
                      src="/image/pud.webp"
                      className="card-img-top p-2"
                      alt="True Wireless"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title small mb-1">True Wireless</h6>
                    <p className="text-success small mb-0">Min. 50% Off</p>
                  </div>
                </div>
              </div>

              {/* Monitors */}
              <div className="col-6">
                <div
                  className="card h-100"
                  onClick={() => handleImageClick("Monitor")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ratio ratio-1x1">
                    <img
                      src="/image/Monitor.webp"
                      className="card-img-top p-2"
                      alt="Monitors"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title small mb-1">Monitors</h6>
                    <p className="text-success small mb-0">Up to 50% Off</p>
                  </div>
                </div>
              </div>

              {/* Headset */}
              <div className="col-6">
                <div
                  className="card h-100"
                  onClick={() => handleImageClick("Headset")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ratio ratio-1x1">
                    <img
                      src="/image/head.webp"
                      className="card-img-top p-2"
                      alt="Headset"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title small mb-1">Headset</h6>
                    <p className="text-success small mb-0">Min. 50% Off</p>
                  </div>
                </div>
              </div>

              {/* Smart Watches */}
              <div className="col-6">
                <div
                  className="card h-100"
                  onClick={() => handleImageClick("SmartWatches")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="ratio ratio-1x1">
                    <img
                      src="/image/watch.webp"
                      className="card-img-top p-2"
                      alt="Smart Watches"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="card-body p-2 text-center">
                    <h6 className="card-title small mb-1">Smart Watches</h6>
                    <p className="text-success small mb-0">Min. 40% Off</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right section: Banner */}
        <div className="col-md-8">
          <div className="position-relative h-100">
            <div className="ratio ratio-16x9 h-100">
              <img
                src="/image/Tab.jpg"
                className="img-fluid rounded-3"
                alt="Top Selling Smartphones"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
            <div className="position-absolute top-50 start-0 translate-middle-y ms-4">
              <button
                className="btn btn-warning px-4 py-2"
                onClick={handleExploreNowClick}
              >
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discount;
