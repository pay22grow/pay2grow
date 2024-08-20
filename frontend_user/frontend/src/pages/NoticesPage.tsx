import React from 'react';
import { FaTelegramPlane } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import "./home.css"
import Header from './Header';
import Footer from './Footer';
const NoticesPage: React.FC = () => {
  const telegramLink = "https://t.me/+MQ1wI6QL31RjYmVl"; 
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
          <Header />
      <div className="text-center space-y-4 p-4 rounded-lg bg-gray-100 shadow-lg max-w-lg mx-auto">
        {/* Logo */}
        <div className="mb-4 text-blue-500">
          <FaTelegramPlane size={80} className="mx-auto" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl space-micro font-bold text-gray-900">Notices</h1>
        
        {/* Message */}
        <p className="text-lg space-micro text-gray-700">
          Have any queries about recharge or any other issues? We’re here to help!
        </p>
        <p className="text-lg space-micro text-gray-700">
          Join our Telegram group and send us a message with your problem. Our team will assist you with the solution as soon as possible.
        </p>

        {/* Telegram Button */}
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 space-micro text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
        >
          Join Telegram Group
        </a>

        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/home')}
          className="block mt-4 bg-gray-800 space-micro text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition w-full"
        >
          Back to Home
        </button>

        {/* Footer Message */}
        <div className="mt-6">
          <p className="text-sm space-micro text-gray-500">We appreciate your queries and look forward to assisting you!</p>
        </div>
      </div>
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default NoticesPage;
