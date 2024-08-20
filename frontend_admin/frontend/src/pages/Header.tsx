import React, { useEffect, useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";
import { customToastStyles } from '../toastStyles'; 
const Header: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post("/admin/details/getDetailsHeader", {}, {
        });
        
        if (response.data.success) {
          setUserName(response.data.admin.name);
        } else {
          console.error("User details not found.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    toast.success("Logging out... You will be redirected now.",{
      style: customToastStyles, 
    });
    localStorage.removeItem("authToken");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleUserClick = () => {
    navigate("/home");
  };

  return (
    <div className="bg-white w-full bg-opacity-80 border border-gray-300 rounded-lg shadow-lg mb-6 p-4">
      <div className="flex items-center justify-between w-full">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleUserClick}
        >
          <FaUser className="text-blue-500 text-3xl" />
          <span className="text-xl font-bold space-mini text-gray-700">{userName || "Loading..."}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="text-sm space-mono">Logout</span>
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Header;
