import React from "react";
import { useNavigate } from "react-router-dom";

const Top = () => {
  const navigate = useNavigate();

  const offers = [
    {
      id: "AllShoe",
      image: "/image/shoes1.jpg",
      title: "Stylish Athletic Shoes",
      description:
        "Get these high-quality athletic shoes at an incredible discount.",
      discount: "Min. 70% off",
    },
    {
      id: "Case",
      image: "/image/case.webp",
      title: "Suit Case",
      description:
        "Get these high-quality Suit Case at an incredible discount.",
      discount: "Min. 70% off",
    },
    {
      id: "Jacket",
      image: "/image/jacket.webp",
      title: "Jackets for men",
      description: "Get these high-quality jackets at an incredible discount.",
      discount: "UPTO 70% off",
    },
    {
      id: "StudentAccessories",
      image: "/image/student.jpg",
      title: "Student Accessories",
      description:
        "Get these high-quality student useful products at an incredible discount.",
      discount: "UPTO 70% off",
    },
  ];

  const handleImageClick = (id) => {
    navigate(`/${id}`);
  };

  return (
    <div className="container py-5">
      <section className="bg-light rounded-3 p-4">
        <h1 className="display-4 mb-4 text-primary">Top Offers</h1>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {offers.map((offer) => (
            <div key={offer.id} className="col">
              <div className="card h-100 shadow-sm hover-shadow transition">
                <div
                  className="card-img-wrapper position-relative overflow-hidden"
                  onClick={() => handleImageClick(offer.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={offer.image}
                    className="card-img-top img-fluid p-3"
                    alt={offer.title}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{offer.title}</h5>
                  <p className="card-text flex-grow-1">{offer.description}</p>
                  <p className="card-text">
                    <span className="badge bg-danger fs-6">
                      {offer.discount}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Top;
