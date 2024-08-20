import React from 'react';
import { FaHome, FaUsers, FaRegCreditCard, FaUserCog } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex justify-around items-center shadow-lg">
      <a href="/home">
        <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-300 text-base relative">
          <FaHome className="text-lg" />
          <span className="space-mono">Home</span>
        </div>
      </a>
      <a href="/updateStatus">
        <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-300 text-base relative">
          <FaUsers className="text-lg" />
          <span className="space-mono">User Status</span>
        </div>
      </a>
      <a href="/recharge">
        <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-300 text-base relative">
          <FaRegCreditCard className="text-lg" />
          <span className="space-mono">Recharge</span>
        </div>
      </a>
      <a href="/profile">
        <div className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition duration-300 text-base relative">
          <FaUserCog className="text-lg" />
          <span className="space-mono">Profile</span>
        </div>
      </a>
    </div>
  );
};

export default Footer;
