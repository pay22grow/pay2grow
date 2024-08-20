import { useEffect, useState } from "react";
import {
  FaScroll,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
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
  const [userDetails, setUserDetails] = useState({ balance: 0, pending: 0 });

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
            <h3 className="text-lg font-semibold space-mono space-monotext-gray-800">Balance</h3>
            <p className="text-2xl font-bold space-mono text-blue-600">{userDetails.balance.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-lg text-center border border-red-300 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold space-mono text-gray-800">Pending</h3>
            <p className="text-2xl font-bold space-mono text-red-600">{userDetails.pending.toFixed(2)}</p>
          </div>
        </div>
      </div>
      {/* Icon Section */}
      <div className="bg-white bg-opacity-50 border border-gray-300 rounded-lg shadow-lg mb-6 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <a href="/rules">
            <div className="bg-red-100 p-4 rounded-lg shadow-lg hover:bg-red-200 transition duration-300 border border-red-300 flex flex-col justify-center items-center">
              <FaScroll className="text-3xl mb-2 text-red-500" />

              <p className="text-base font-semibold space-mono text-gray-800">Rules</p>
            </div>
          </a>
          <a href="/history">
            <div className="bg-blue-100 p-4 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 border border-blue-300 flex flex-col justify-center items-center">
              <FaClipboardList className="text-3xl mb-2 text-blue-500" />
              <p className="text-base font-semibold space-mono text-gray-800">History</p>
            </div>
          </a>
          <a href="/notices">
            <div className="bg-green-100 p-4 rounded-lg shadow-lg hover:bg-green-200 transition duration-300 border border-green-300 flex flex-col justify-center items-center">
              <FaBell className="text-3xl mb-2 text-green-500" />
              <p className="text-base font-semibold space-mono text-gray-800">Notices</p>
            </div>
          </a>
          <a href="/referal">
            <div className="bg-purple-100 p-4 rounded-lg shadow-lg hover:bg-purple-200 transition duration-300 border border-purple-300 flex flex-col justify-center items-center">
              <FaMoneyBillTrendUp className="text-3xl mb-2 text-purple-500" />
              <p className="text-base font-semibold space-mono text-gray-800">Referral</p>
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
