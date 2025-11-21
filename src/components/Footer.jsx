import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10" style={{margin:'20px'}}>
      <div className="container mx-auto">
        <div className="row">
          {/* Column 1 */}
          <div className="col-md-3 mb-4" style={{ marginTop: "50px" }}>
            <h3 className="text-lg font-bold">Download My App</h3>
            <p className="text-gray-400">
              Download App for Android or iOS mobile phones.
            </p>
            <div className="flex mt-4">
              <img
                src="/image/Store.png"
                alt="Android"
                className="w-20 h-20 object-cover mr-4"
                style={{ width: "150px", paddingRight: "20px" }}
              />
              <img
                src="/image/Apstore.jpg"
                alt="iOS"
                className="w-20 h-20 object-cover"
                style={{ width: "150px", paddingLeft: "20px" }}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-md-3 mb-4 text-center">
            <img
              src="image/logo.jpg"
              alt="Logo"
              className="mx-auto w-24 h-24 object-contain mb-4"
              style={{ marginTop: "50px" ,width:'200px' }}
            />
            <p className="text-gray-400">
              Our purpose is to sustainably make the pleasure and benefits of
              sports accessible to many.
            </p>
          </div>

          {/* Column 3 */}
          <div className="col-md-3 mb-4" style={{ marginTop: "50px" }}>
            <h3 className="text-lg font-bold">Useful Links</h3>
            <ul className="mt-4 space-y-2">
              <li className="hover:text-gray-300 cursor-pointer">Coupons</li>
              <li className="hover:text-gray-300 cursor-pointer">Blog Post</li>
              <li className="hover:text-gray-300 cursor-pointer">
                Return Policy
              </li>
              <li className="hover:text-gray-300 cursor-pointer">
                Join Affiliates
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="col-md-3 mb-4" style={{ marginTop: "50px" }}>
            <h3 className="text-lg font-bold">Follow Me</h3>
            <ul className="mt-4 space-y-2">
              <li className="hover:text-gray-300 cursor-pointer">Facebook</li>
              <li className="hover:text-gray-300 cursor-pointer">Instagram</li>
              <li className="hover:text-gray-300 cursor-pointer">
                X (formerly Twitter)
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} Cart-with-charan Website. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
