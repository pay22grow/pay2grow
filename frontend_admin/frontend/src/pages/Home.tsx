import { useEffect, useState } from "react";
import {
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import { FaCreditCard, FaMoneyBillTrendUp } from "react-icons/fa6";
import Header from "./Header";
import axios from "../axiosConfig";
import "./home.css"
import Footer from "./Footer";
const HomePage = () => {
  const [prices, setPrices] = useState({
    todayPrice: "",
    wazirxPrice: "",
    binancePrice: "",
    kuCoinPrice: "",
  });
  const [,setUserDetails] = useState({ balance: 0, pending: 0 });
  const [totals, setTotals] = useState({ totalBalance: 0, totalPending: 0 });
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get("/admin/edit/getPrices");
        const prices = response.data.setPrices;
    
        if (prices) {
          setPrices({
            todayPrice: prices.todaysRate,
            wazirxPrice: prices.wazirXRate, 
            binancePrice: prices.binanceRate,
            kuCoinPrice: prices.kuCoinRate,
          });
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    const fetchTotals = async () => {
      try {
        const response = await axios.get("admin/details/calculateTotals");
        if (response.data.success) {
          setTotals({
            totalBalance: response.data.totalBalance,
            totalPending: response.data.totalPending,
          });
        }
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    };
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post("/user/details/getDetailsHome");
    
        if (response.data.success) {
          setUserDetails({ balance: response.data.user.balance, pending: response.data.user.pending });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchPrices();
    fetchUserDetails();
    fetchTotals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-6">
      <Header />
      {/* Today Price and Rates Section */}
      <div className="bg-white bg-opacity-70 border border-gray-300 rounded-lg shadow-lg mb-6 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-100 p-6 rounded-lg shadow-lg text-center border border-yellow-300 flex flex-col justify-center items-center">
            <h2 className="text-sm md:text-base font-semibold text-gray-800 space-mono">
              Today Price
            </h2>
            <p className="text-lg text-gray-600 font-semibold space-mono text-green-600">{prices.todayPrice} INR</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-lg shadow-lg text-center border border-blue-300 flex flex-col justify-center items-center">
            <p className="text-sm md:text-base font-semibold text-gray-800 space-mono">
              WazirX Price
            </p>
            <p className="text-lg text-gray-600 font-semibold space-mono text-green-600">{prices.wazirxPrice} INR</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-lg text-center border border-red-300 flex flex-col justify-center items-center">
            <p className="text-sm md:text-base font-semibold space-mono text-gray-800">
              Binance Price
            </p>
            <p className="text-lg text-gray-600 font-semibold space-mono text-green-600">{prices.binancePrice} INR</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center border border-green-300 flex flex-col justify-center items-center">
            <p className="text-sm font-semibold space-mono text-gray-800">KuCoin Price</p>
            <p className="text-lg text-gray-600 font-semibold space-mono text-green-600">{prices.kuCoinPrice} INR</p>
          </div>
        </div>
      </div>

      {/* Balance and Pending Section */}
      <div className="bg-white bg-opacity-60 border border-gray-300 rounded-lg shadow-lg mb-6 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-6 rounded-lg shadow-lg text-center border border-blue-300 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold space-mono space-monotext-gray-800">Total Balance of all Users</h3>
            <p className="text-2xl font-bold space-mono text-blue-600">{totals.totalBalance.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-lg text-center border border-red-300 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold space-mono text-gray-800">Total Pending Balance</h3>
            <p className="text-2xl font-bold space-mono text-red-600">{totals.totalPending.toFixed(2)}</p>
          </div>
        </div>
      </div>
      {/* Icon Section */}
      <div className="bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-lg mb-6 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <a href="/updatePrices">
            <div className="bg-red-100 p-4 rounded-lg shadow-lg hover:bg-red-200 transition duration-300 border border-red-300 flex flex-col justify-center items-center">
              <FaMoneyBillTrendUp className="text-3xl mb-2 text-red-500" />

              <p className="text-base font-semibold space-mono text-gray-800">Update Prices</p>
            </div>
          </a>
          <a href="/users">
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 border border-blue-300 flex flex-col justify-center items-center">
              <FaUser className="text-3xl mb-2 text-blue-500" />
              <p className="text-base font-semibold space-mono text-gray-800">View All Users</p>
            </div>
          </a>
          <a href="/updateStatus">
            <div className="bg-green-100 p-4 rounded-lg shadow-lg hover:bg-green-200 transition duration-300 border border-green-300 flex flex-col justify-center items-center">
              <FaCheckCircle className="text-3xl mb-2 text-green-500" />
              <p className="text-base font-semibold space-mono text-gray-800">Edit User Status</p>
            </div>
          </a>
          <a href="/recharge">
            <div className="bg-purple-100 p-4 rounded-lg shadow-lg hover:bg-purple-200 transition duration-300 border border-purple-300 flex flex-col justify-center items-center">
            <FaCreditCard  className="text-3xl mb-2 text-purple-500" />
              <p className="text-base font-semibold space-mono text-gray-800">Recharge</p>
            </div>
          </a>
        </div>
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
