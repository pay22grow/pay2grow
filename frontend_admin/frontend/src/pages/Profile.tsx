/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "../axiosConfig"; 
import toast, { Toaster } from "react-hot-toast";
import "./home.css";
import Footer from "./Footer";
import { customToastStyles } from "../toastStyles";

interface AdminResponse {
  success: boolean;
  message: string;
  admin : Admin;
}
interface Admin {
  _id: string;
  status: string;
  name: string;
  phoneNumber: number;
  email: string;
  pointsHandled: number;
  transactionsHandled: number;
  
}
interface StatsResponse {
  success: boolean;
  uniqueRechargesHandled: number;
  totalAmountHandled: number;
}


const Profile: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [status, setStatus] = useState<string>("Inactive");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [transactionsHandled, setTransactionsHandled] = useState<number>(0);
  const [pointsHandled, setPointsHandled] = useState<number>(0);
  const [, setUserId] = useState<string>("");
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post<AdminResponse>(`/admin/details/getDetailsProfile`);
        if (response.data.success) {
          const {  status = "Inactive", name = "", phoneNumber = 0, email = "", _id = "",pointsHandled=0,transactionsHandled=0 } = response.data.admin;
          setBalance(balance);
          setStatus(status);
          setName(name);
          setEmail(email);
          setPhoneNumber(phoneNumber);
          setPointsHandled(pointsHandled);
          setTransactionsHandled(transactionsHandled);

          
          setUserId(_id);
        } else {
          console.error("User details not found.");
          toast.error("User Details not fount.", {
            style: customToastStyles
          })
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Error fetching user details.", {
          style: customToastStyles
        })
      }
    };
    const fetchAdminStats = async () => {
      try {
        // Fetch admin transaction stats
        const statsResponse = await axios.get<StatsResponse>(`/admin/recharge/stats`);
        if (statsResponse.data.success) {
          setTransactionsHandled(statsResponse.data.uniqueRechargesHandled);
          setPointsHandled(statsResponse.data.totalAmountHandled);
        } else {
          console.error("Failed to fetch admin stats.");
          toast.error("Failed to fetch admin stats.", {
            style: customToastStyles
          })
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("Error fetching admin stats:", {
          style: customToastStyles
        })
      }
    };

    fetchUserDetails();
    fetchAdminStats();
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
      {/* Header Section */}
      <Header />

      {/* Points and Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold space-micro text-gray-700 mb-2">Points Handled</h3>
          <p className="text-2xl font-bold space-micro text-blue-500">{pointsHandled.toFixed(2)}</p>
        </div>
        <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold space-micro text-gray-700 mb-2">Status</h3>
          <p className="text-2xl font-bold space-micro" style={{
              color: status === "Active" ? "green" : status === "Inactive" ? "orange" : status === "Blocked" ? "red" : "black"}}>{status}</p>
        </div>
      </div>

      {/* Personal Info and Bank Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Personal Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 space-micro mb-4">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-semibold space-micro text-gray-500 uppercase">Name</span>
              <p className="text-lg font-medium space-micro text-gray-800 mt-1">{name}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold space-micro text-gray-500 uppercase">Phone</span>
              <p className="text-lg font-medium space-micro text-gray-800 mt-1">{phoneNumber}</p>
            </div>
            <div className="flex flex-col col-span-1 md:col-span-2">
              <span className="text-sm font-semibold space-micro text-gray-500 uppercase">Email</span>
              <p className="text-lg font-medium space-micro text-gray-800 mt-1">{email}</p>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg text-center shadow-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold space-micro text-gray-700 mb-4">
              Total Transactions Handled
            </h3>
            <p className="text-2xl font-bold space-micro text-blue-500">{transactionsHandled}</p>
          </div>
        </div>

      </div>
    <Toaster position="top-center" />
    <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
