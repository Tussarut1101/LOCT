import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./Login/Login";
import Home from "./Login/Home";
import TransactionMain from "./Transaction/TransactionMain";
import TransactionDetail from "./Transaction/TransactionDetail";
import ReportGroup from "./Report/ReportGroup/ReportGroup";
import ReportPrint from "./Report/Print/PrintOut";
import QRcode from "./Report/QRcode/QRcode";
import Docprint from "./Report/Print/PrintFile";

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/LOCTSystem" element={<Login />} />
          <Route path="/LOCTSystem/Home" element={<Home />} />
          <Route path="/LOCTSystem/Transaction" element={<TransactionMain />} />
          <Route path="/LOCTSystem/Transaction/Maintain" element={<TransactionDetail />} />
          <Route path="/LOCTSystem/Report/Group" element={<ReportGroup />} />
          <Route path="/LOCTSystem/Report/Print" element={<ReportPrint />} />
          <Route path="/LOCTSystem/Report/QRcode" element={<QRcode />} />
          <Route path="/LOCTSystem/Print" element={<Docprint />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
export default App;