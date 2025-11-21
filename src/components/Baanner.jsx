import React, { useEffect } from "react";

const Carousel = () => {
  useEffect(() => {
    const carouselElement = document.getElementById(
      "carouselExampleIndicators"
    );
    const carousel = new window.bootstrap.Carousel(carouselElement, {
      interval: 3000,
      ride: "carousel",
      touch: true, // Enable touch swipe on mobile
    });

    return () => {
      carousel.pause();
    };
  }, []);

  return (
    <div className="container-fluid px-0 my-4">
      <div
        id="carouselExampleIndicators"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        {/* Custom Indicators */}
        <div className="carousel-indicators">
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                margin: "0 6px",
              }}
            ></button>
          ))}
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner rounded-4 shadow-lg">
          <div className="carousel-item active">
            <div className="ratio ratio-21x9">
              <img
                src="/image/samsung.png"
                className="d-block w-100"
                alt="Slide 1"
                style={{
                  objectFit: "cover",
                  backgroundColor: "#f8f9fa",
                }}
              />
            </div>
          </div>
          {[
            "/image/laptop.jpg",
            "/image/banner3.jpg",
            "/image/nothing.webp",
            "/image/banner5.jpg",
          ].map((src, index) => (
            <div key={index} className="carousel-item">
              <div className="ratio ratio-21x9">
                <img
                  src={src}
                  className="d-block w-100"
                  alt={`Slide ${index + 2}`}
                  style={{
                    objectFit: "cover",
                    backgroundColor: "#f8f9fa",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Custom Navigation Buttons */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <div
            className="d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle"
            style={{ width: "40px", height: "40px" }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
          </div>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <div
            className="d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle"
            style={{ width: "40px", height: "40px" }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
          </div>
          <span className="visually-hidden">Next</span>
        </button>

        {/* Optional Caption */}
        <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-pill px-4 py-2">
          <h5 className="mb-0">Latest Deals and Offers</h5>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
