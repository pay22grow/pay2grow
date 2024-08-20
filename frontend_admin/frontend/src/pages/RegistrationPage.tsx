/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import "./home.css";
import "react-toastify/dist/ReactToastify.css";
import { customToastStyles } from '../toastStyles';
interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}



const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/^\+91\s*/, "").trim();
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    setSuccess("");

    const {
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match",{
        style: customToastStyles, 
      });
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",{
        style: customToastStyles, 
      });
      return;
    }

    try {
      setLoading(true);
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      const lowerCaseEmail = email.toLowerCase();
      

      // Create admin
      await axios.post("/admin/details/signup", {
        name,
        email: lowerCaseEmail,
        phoneNumber: formattedPhoneNumber,
        password,

      });
      toast.success("Admin created successfully!",{
        style: customToastStyles, 
      });
      setSuccess("Admin created successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        toast.error(err.response.data.message || "Failed to create admin",{
          style: customToastStyles, 
        });
      } else {
        toast.error("An unexpected error occurred",{
          style: customToastStyles, 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold space-micro text-gray-800 text-center mb-4">
            Create Your Account
          </h2>
          {success && (
            <p className="mb-4 text-green-500 space-micro text-center">{success}</p>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm space-micro font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 block w-full px-3 py-2 space-micro border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium space-micro text-gray-700">
                Mobile Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+91 8942340981"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 space-micro rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium space-micro text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 space-micro rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium space-micro text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 space-micro rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 space-micro flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff className="h-5 w-5 space-micro mt-5 text-gray-400" /> : <HiEye className="h-5 w-5 mt-5 text-gray-400" />}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm space-micro font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 space-micro rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 space-micro flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff className="h-5 w-5 mt-5 space-micro text-gray-400" /> : <HiEye className="h-5 w-5 mt-5 text-gray-400" />}
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold space-micro rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default RegistrationPage;
