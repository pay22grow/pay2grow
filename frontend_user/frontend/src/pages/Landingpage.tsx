/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom"; 
import "./home.css";
const LoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("/user/auth/login", {
        email: emailOrPhone.includes("@") ? emailOrPhone.toLowerCase() : undefined,
        phoneNumber: emailOrPhone.includes("@") ? undefined : emailOrPhone,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/home");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center md:space-x-8 space-y-8 md:space-y-0">
        <div className="w-full md:w-1/2">
          <img
            src="/img/pay_bc.png"
            alt="Financial Image"
            className="object-cover w-full h-full rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/3 bg-white p-6 md:p-8 rounded-lg shadow-lg flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 space-micro text-gray-700 text-center">
            Login
          </h2>
          {error && <p className="text-red-500 space-micro mb-4">{error}</p>}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="userId"
                className="block text-sm space-micro font-medium text-gray-700"
              >
                Email or Phone Number
              </label>
              <input
                type="text"
                id="userId"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                autoComplete="off" 
                className="mt-1 block w-full px-4 py-2 border border-gray-300 space-micro rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium space-micro text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="off" 
                className="mt-1 block w-full px-4 py-2 border border-gray-300 space-micro rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md space-micro shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
          <p className="mt-4 text-sm text-gray-600 space-micro text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 space-micro hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
