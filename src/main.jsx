import React from "react";
import { createRoot } from "react-dom/client";
import Navbar from "./components/Navbar";
import Baanner from "./components/Baanner";
import Top from "./components/Top";
import Cart from "./components/Cart";
import Case from "./components/Case";
import Jacket from "./components/Jacket";
import StudentAccessories from "./components/StudentAccessories";
import Discount from "./components/Discount";
import Dis from "./components/Dis";
import Footer from "./components/Footer";
import AllEarbuds from "./components/Allearbuds";
import Monitor from "./components/Monitor";
import Headset from "./components/Headset";
import SmartWatches from "./components/SmartWatches";
import TabletBrands from "./components/TabletBrand";
import Cycle from "./components/Cycle";

import WaterBottle from "./components/WaterBottle";
import Tshirt from "./components/Tshirt";
// import Slicer from "./components/Slicer";

import PressureCooker from "./components/PressureCooker";
import Mixer from "./components/Mixer";
import AppleTab from "./components/AppleTab";
import SamsungTab from "./components/SamsungTab";
import Microsoft from "./components/Microsoft";
import New from "./components/New";
import { AllShoe } from "./components/AllShoe";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Card from "./components/Card";

import ShoeDetail from "./components/shoes/ShoeDetail";
import CircularGallery from "./components/CircularGallery";
import RollingGallery from "./components/RollingGallery";
import HP from "./components/Student/HP";
import Dell from "./components/Student/Dell";
import Classmate from "./components/Student/Classmate";
import SonyHeadset from "./components/Student/SonyHeadset";
import PowerBank from "./components/Student/PowerBank";
import AlarmClock from "./components/Student/AlramClock";
import TableLamp from "./components/Student/TableLamp";
import Pens from "./components/Student/Pens";
import DellLaptopTable from "./components/Student/DellLaptopTable";
import Keyboard from "./components/Student/Keyboard";
import NikeWaterBottle from "./components/Student/NikeWaterBottle";
import PencilKit from "./components/Student/PencilKit";
import SanDiskSSD from "./components/Student/SanDiskSSD";
import Sony2 from "./components/Student/Sony2";
import LogitechMouse from "./components/Student/LogitechMouse";

// Product detail components
import ALLCase from "./components/Case/ALLCase";
import ProductDetails from "./components/Case/ProductDetails";
import ProductShoe from "./components/shoes/ProductShoe";
import EarbudsAll from "./components/Earbuds/EarbudsAll";
import JacketsAll from "./components/Jacket/JacketsAll";
import MonitorAll from "./components/Monitor/MonitorAll";
import Stand from "./components/Stand";
import Bank from "./components/bank";
import Lights from "./components/Lights";
import Cool from "./components/Cool";
import HeadsetDetails from "./components/HeadsetDetails";
import Smart from "./components/Smart";
import Banks from "./components/Banks";
import LightDetails from "./components/LightDetails";
import TshirtDetails from "./components/TshirtsDetails";
import StandDetails from "./components/StandDetails";
import CoolAll from "./components/coolAll";
// Main Index Component
const Index = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Baanner />
      </div>
      <Top />
      <br />
      <Discount />
      <br />
      <Dis />
      <br />
      <Footer />
    </>
  );
};

// Render the App into the Root Element
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <BrowserRouter>
      <Routes>
        {/* Redirect / to /home */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Index />} />
        <Route path="/Cart" element={<Cart />} />

        {/* SHOES ROUTES - Most specific first */}
        <Route path="/shoes" element={<AllShoe />} />
        <Route path="/shoe/:id" element={<ShoeDetail />} />

        {/* CASE ROUTES - Specific case routes */}
        <Route path="/cases" element={<Case />} />
        <Route path="/case/:brand/:id" element={<ProductDetails />} />

        {/* JACKET ROUTES - Specific jacket routes */}
        <Route path="/jackets" element={<Jacket />} />
        <Route path="/jacket/:id" element={<JacketsAll />} />

        {/* EARBUDS ROUTES - Specific earbuds routes */}
        <Route path="/Allearbuds" element={<AllEarbuds />} />
        <Route path="/product/:id" element={<EarbudsAll />} />
        <Route path="/earbuds-details/:id" element={<EarbudsAll />} />
        {/* MONITOR ROUTES */}
        <Route path="/monitors" element={<Monitor />} />
        <Route path="/Monitor/:id" element={<MonitorAll />} />

        <Route path="/headset" element={<Headset />} />
        <Route path="/headphones/:brand/:id" element={<HeadsetDetails />} />

        <Route path="/SmartWatches" element={<SmartWatches />} />
        <Route path="/product/:brand/:id" element={<Smart />} />

        <Route path="/powerbanks" element={<Bank />} />
        <Route path="/powerbank/:id" element={<Banks />} />

        <Route path="/lights" element={<Lights />} />
        <Route path="/lights/:brand/:id" element={<LightDetails />} />

        <Route path="/tshirt" element={<Tshirt />} />
        <Route path="/tshirt/:brand/:id" element={<TshirtDetails />} />

        <Route path="/Stand" element={<Stand />} />
        <Route path="/table/:brand/:id" element={<StandDetails />} />

        <Route path="/cool" element={<Cool />} />
        <Route path="/cool/:brand/:id" element={<CoolAll />} />

        {/* STUDENT ACCESSORIES ROUTES */}
        <Route path="/student-accessories" element={<StudentAccessories />} />
        <Route path="/student/HP/1" element={<HP />} />
        <Route path="/student/Hauser/2" element={<Pens />} />
        <Route path="/student/Sony/3" element={<SonyHeadset />} />
        <Route path="/student/Ambrane/4" element={<PowerBank />} />
        <Route path="/student/Dell/5" element={<Dell />} />
        <Route path="/student/Casio/6" element={<AlarmClock />} />
        <Route path="/student/Philips/7" element={<TableLamp />} />
        <Route path="/student/Classmate/8" element={<Classmate />} />
        <Route path="/student/Sony/9" element={<Sony2 />} />
        <Route path="/student/Apsara/10" element={<PencilKit />} />
        <Route path="/student/SanDisk/11" element={<SanDiskSSD />} />
        <Route path="/student/Asus/12" element={<Keyboard />} />
        <Route path="/student/Nike/13" element={<NikeWaterBottle />} />
        <Route path="/student/Dell/14" element={<DellLaptopTable />} />
        <Route path="/student/Logitech/15" element={<LogitechMouse />} />

        {/* TABLET ROUTES */}
        <Route path="/tablets" element={<TabletBrands />} />
        <Route path="/tablet/apple" element={<AppleTab />} />
        <Route path="/tablet/samsung" element={<SamsungTab />} />
        <Route path="/tablet/microsoft" element={<Microsoft />} />

        {/* OTHER PRODUCT ROUTES */}
        <Route path="/smart-watches" element={<SmartWatches />} />
        <Route path="/cycles" element={<Cycle />} />

        <Route path="/water-bottles" element={<WaterBottle />} />
        <Route path="/t-shirts" element={<Tshirt />} />
        <Route path="/Stand" element={<Stand />} />

        <Route path="/pressure-cookers" element={<PressureCooker />} />
        <Route path="/mixers" element={<Mixer />} />

        {/* LEGACY ROUTES - Keep for backward compatibility */}
        <Route path="/AllShoe" element={<AllShoe />} />
        <Route path="/Case" element={<Case />} />
        <Route path="/Jacket" element={<Jacket />} />
        <Route path="/StudentAccessories" element={<StudentAccessories />} />
        <Route path="/Allearbuds" element={<AllEarbuds />} />
        <Route path="/Monitor" element={<Monitor />} />
        <Route path="/Headset" element={<Headset />} />
        <Route path="/SmartWatches" element={<SmartWatches />} />
        <Route path="/explorenow" element={<TabletBrands />} />
        <Route path="/explore" element={<Mixer />} />
        <Route path="/Cycle" element={<Cycle />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/Lights" element={<Lights />} />
        <Route path="/Cool" element={<Cool />} />

        <Route path="/WaterBottle" element={<WaterBottle />} />
        <Route path="/Tshirt" element={<Tshirt />} />
        {/* <Route path="/Stand" element={<Stand />} /> */}

        <Route path="/PressureCooker" element={<PressureCooker />} />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
} else {
  console.error("No root element found");
}
