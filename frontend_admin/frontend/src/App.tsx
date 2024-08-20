import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import Home from "./pages/Home";
import UserProfiles from "./pages/UserProfiles";
import Recharge from "./pages/Recharge";
import Profile from "./pages/Profile";
import UpdatePrices from "./pages/UpdatePrices";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import UserUpdates from "./pages/UserUpdates";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PublicRoute element={LandingPage} />} />
            <Route path="/grow2pay" element={<RegistrationPage />} />
            <Route path="/home" element={<PrivateRoute element={Home} />} />
            <Route path="/users" element={<PrivateRoute element={UserProfiles} />} />
            <Route path="/recharge" element={<PrivateRoute element={Recharge} />} />
            <Route path="/profile" element={<PrivateRoute element={Profile} />} />
            <Route path="/updatePrices" element={<PrivateRoute element={UpdatePrices} />} />
            <Route path="/updateStatus" element={<PrivateRoute element={UserUpdates} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
