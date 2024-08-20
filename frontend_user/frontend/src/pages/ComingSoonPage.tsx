import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "./home.css"
import Footer from './Footer';
import Header from './Header';
const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-6">
      <Header />
      <div className="text-center space-y-8 p-8 rounded-lg bg-gray-100 mt-20 shadow-xl max-w-lg mx-auto">
        <h1 className="text-5xl font-bold space-micro text-gray-900">Coming Soon...</h1>
        <p className="text-xl space-micro text-gray-700">
          We're working hard to finish the development of this page. Stay tuned!
        </p>
        <button
          onClick={handleReturnHome}
          className="mt-6 w-full bg-gray-500 space-micro py-3 rounded-lg text-white font-semibold hover:bg-gray-600 transition"
        >
          Return to Home
        </button>

        <div className="mt-10">
          <p className="text-sm space-micro text-gray-500">© {new Date().getFullYear()} Pay2Grow. All rights reserved.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComingSoonPage;
