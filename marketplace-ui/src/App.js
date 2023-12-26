import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Create from "./pages/Create";
import NFTDetail from './pages/NFTDetail';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Footer from "./components/Footer";
import { contractAddress } from "./constants";

function App() {

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/:address" element={<Profile />} />
        <Route path={`/${contractAddress}/:tokenId`} element={<NFTDetail />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
