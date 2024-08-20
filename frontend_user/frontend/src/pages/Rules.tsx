import React from "react";
import Header from "./Header";
import "./home.css";
import Footer from "./Footer";

const Rules: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6 flex flex-col justify-between">
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <div className="flex-grow">
        <div className="bg-white w-full bg-opacity-80 border border-gray-300 rounded-lg shadow-lg p-4 mt-6">
          <h2 className="text-2xl font-semibold space-micro text-gray-700 mb-4">
            Rules for Using Our Service
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-gray-700 space-micro text-sm md:text-base">
              Don't spam the system with multiple requests.
            </li>
            <li className="text-gray-700 space-micro text-sm md:text-base">
              Don't try to trick the system; doing so will result in a permanent
              ban.
            </li>
            <li className="text-gray-700 space-micro text-sm md:text-base">
              If you have any problems, contact us on{" "}
              <a
                href="https://t.me/+MQ1wI6QL31RjYmVl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Telegram
              </a>
              .
            </li>
          </ul>
          <div className="mt-6 flex justify-center">
            <img
              src="/img/rules.png"
              alt="Rules"
              className="w-2/3 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Rules;
