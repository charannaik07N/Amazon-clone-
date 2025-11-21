import React from "react";

const New = () => {
  const images = [
    ["/image/America1.jpg", "/image/America1.jpg"],
    ["/image/America1.jpg", "/image/America1.jpg", "/image/America1.jpg"],
    ["/image/America1.jpg", "/image/America1.jpg"],
  ];

  return (
    <div className="position-relative overflow-hidden bg-white">
      <div className="container-fluid py-5">
        <div className="container position-relative min-vh-75 d-flex align-items-center">
          {/* Text Content */}
          <div className="row">
            <div className="col-lg-5 position-relative" style={{ zIndex: 2 }}>
              <div className="pe-lg-4">
                <h1 className="display-3 fw-bold text-dark mb-4 animate__animated animate__fadeIn">
                  Summer styles are finally here
                </h1>
                <p className="lead text-secondary mb-5 animate__animated animate__fadeIn animate__delay-1s">
                  This year, our new summer collection will shelter you from the
                  harsh elements of a world that doesn't care if you live or
                  die.
                </p>
                <button className="btn btn-lg custom-btn shadow-sm animate__animated animate__fadeIn animate__delay-2s">
                  Shop Collection
                </button>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <h1
            className="text-center text-dark animate__animated animate__fadeIn"
            style={{
              opacity: 0,
              transition: "opacity 1s ease-in-out",
              marginTop: "20px",
            }}
            onLoad={() => {
              setTimeout(() => {
                document.querySelector(".text-center").style.opacity = 1;
              }, 100);
            }}
          >
            Welcome to Mobile Purchase
          </h1>

          {/* Image Grid */}
          <div className="image-grid-wrapper d-none d-lg-block">
            <div className="floating-grid">
              <div className="d-flex gap-4">
                {/* First Column */}
                <div className="d-flex flex-column gap-4">
                  {images[0].map((img, index) => (
                    <div key={`col1-${index}`} className="image-card">
                      <img
                        src={img}
                        alt=""
                        className="img-fluid rounded-3 shadow"
                      />
                    </div>
                  ))}
                </div>

                {/* Middle Column */}
                <div className="d-flex flex-column gap-4">
                  {images[1].map((img, index) => (
                    <div key={`col2-${index}`} className="image-card">
                      <img
                        src={img}
                        alt=""
                        className="img-fluid rounded-3 shadow"
                      />
                    </div>
                  ))}
                </div>

                {/* Last Column */}
                <div className="d-flex flex-column gap-4">
                  {images[2].map((img, index) => (
                    <div key={`col3-${index}`} className="image-card">
                      <img
                        src={img}
                        alt=""
                        className="img-fluid rounded-3 shadow"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .min-vh-75 {
            min-height: 75vh;
          }

          .custom-btn {
            background-color: #4F46E5;
            color: white;
            padding: 1rem 2.5rem;
            border: none;
            transition: all 0.3s ease;
          }

          .custom-btn:hover {
            background-color: #4338CA;
            transform: translateY(-2px);
          }

          .image-grid-wrapper {
            position: absolute;
            right: -5%;
            top: 0;
            width: 65%;
            height: 100%;
          }

          .floating-grid {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          .image-card {
            width: 176px;
            height: 256px;
            overflow: hidden;
            transition: transform 0.3s ease;
          }

          .image-card:hover {
            transform: translateY(-5px);
          }

          .image-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @media (max-width: 991.98px) {
            .min-vh-75 {
              min-height: auto;
              padding: 4rem 0;
            }

            .image-grid-wrapper {
              position: relative;
              width: 100%;
              height: auto;
              margin-top: 20px; /* Add some margin for smaller screens */
            }

            .floating-grid {
              position: relative;
              top: auto;
              transform: none;
              display: flex;
              flex-wrap: wrap;
              justify-content: center; /* Center images on smaller screens */
            }

            .image-card {
              width: 100%; /* Full width on smaller screens */
              max-width: 300px; /* Limit max width */
              margin-bottom: 20px; /* Space between images */
            }
          }
        `}
      </style>

      {/* Bootstrap and Animation CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
};

export default New;
