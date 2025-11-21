# Cart with Charan - E-commerce Platform

A full-featured e-commerce platform built with React for the frontend and Node.js/Express for the backend. This application offers a seamless shopping experience for various product categories including electronics, fashion, accessories, and more.

## Features

- **Responsive Design**: Built with mobile-first approach, ensuring compatibility across all devices
- **Product Categories**: Multiple product categories including monitors, headphones, earbuds, watches, cases, t-shirts, and more
- **Product Details**: Detailed product pages with specifications, features, and multiple images
- **Shopping Cart**: Add items to cart, update quantities, and remove items
- **Search Functionality**: Search products by name, brand, or category
- **User Authentication**: Secure login and registration system
- **Admin Dashboard**: Manage products, orders, and users

## Project Structure

### Frontend (React)

```
/src
  /components        - React components organized by feature
    /Case            - Components for case/luggage products
    /Earbuds         - Components for earbuds products
    /Jacket          - Components for jacket products
    /Monitor         - Components for monitor products
    /Student         - Components for student accessories
    /shoes           - Components for footwear products
  /assets            - Static assets like images and fonts
```

### Backend (Node.js/Express)

```
/backend
  /config            - Configuration files (DB connection, etc.)
  /controllers       - Request handlers for each route
  /Data              - Product data files
  /Models            - Database models
  /routes            - API route definitions
```

## Technologies Used

### Frontend
- React
- React Router
- Tailwind CSS
- Vite (Build tool)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Tools
- Git for version control
- npm for package management

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cart-with-charan.git
   cd cart-with-charan
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   npm install
   ```

4. Configure environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     JWT_SECRET=your_jwt_secret
     ```

5. Start the backend server
   ```
   npm start
   ```

6. In a new terminal, start the frontend development server
   ```
   cd ..
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## Product Categories

The application features a wide range of products across various categories:

- **Monitors**: High-quality displays from brands like BenQ, LG, Samsung, and Acer
- **Headphones & Earbuds**: Audio devices from brands like Sony, Bose, Apple, and Samsung
- **Smart Watches**: Wearables from Apple, Samsung, Garmin, and Fitbit
- **Luggage & Cases**: Travel bags from American Tourister, Sky Bags, and more
- **Clothing**: T-shirts and jackets from popular brands like Adidas, Puma, and Reebok
- **Accessories**: Cooling pads, power banks, stands, and student accessories

## Image Organization

Product images are organized in the following structure:

- `/image/` - Common images and product thumbnails
- `/Case/` - Detailed images for luggage and cases
- `/cooling/` - Images for cooling products
- `/Earpuds/` - Images for earbuds and audio devices
- `/Headset/` - Images for headphones
- `/Jackets/` - Images for jackets and clothing
- `/light/` - Images for lighting products
- `/Monitor/` - Images for monitor products
- `/power/` - Images for power banks and accessories
- `/Shoes/` - Images for footwear
- `/Stand/` - Images for stands and mounts
- `/Student/` - Images for student accessories
- `/tshirt/` - Images for t-shirts
- `/Watch/` - Images for smartwatches and wearables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.