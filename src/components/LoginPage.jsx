import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg flex overflow-hidden max-w-4xl w-full">
        {/* Left Section */}
        <div className="bg-blue-500 text-white p-12 relative flex-1">
          <div className="absolute inset-0 bg-blue-400 rounded-[100px] translate-x-[-30%]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Hello, Welcome!</h2>
            <p className="mb-8 text-sm opacity-90">Don't have an account?</p>
            <button className="border-2 border-white text-white px-8 py-2 rounded-lg hover:bg-white hover:text-blue-500 transition-colors">
              Register
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-12 flex-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Login</h2>

            <form className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    👤
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    🔒
                  </span>
                </div>
              </div>

              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-500"
                >
                  Forgot Password?
                </a>
              </div>

              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Login
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    or login with social platforms
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="w-6 h-6 block">G</span>
                </button>
                <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="w-6 h-6 block">f</span>
                </button>
                <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="w-6 h-6 block">GH</span>
                </button>
                <button className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="w-6 h-6 block">in</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
