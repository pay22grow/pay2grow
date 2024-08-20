import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landingpage";
import RegistrationPage from "./pages/RegistrationPage";
import Home from "./pages/Home";
import HistoryPage from "./pages/History";
import Recharge from "./pages/Recharge";
import Profile from "./pages/Profile";
import Rules from "./pages/Rules";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer } from 'react-toastify';
import ComingSoonPage from "./pages/ComingSoonPage";
import NoticesPage from "./pages/NoticesPage";
const App: React.FC = () => {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PublicRoute element={LandingPage} />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/home" element={<PrivateRoute element={Home} />} />
            <Route path="/history" element={<PrivateRoute element={HistoryPage} />} />
            <Route path="/recharge" element={<PrivateRoute element={Recharge} />} />
            <Route path="/profile" element={<PrivateRoute element={Profile} />} />
            <Route path="/rules" element={<PrivateRoute element={Rules} />} />
            <Route path="/referal" element={<PrivateRoute element={ComingSoonPage} />} />
            <Route path="/notices" element={<PrivateRoute element={NoticesPage} />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;

