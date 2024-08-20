import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../axiosConfig";

interface PublicRouteProps {
  element: React.ComponentType;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element: Component }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.post("/user/validate/validate-token", { token });
        setIsValid(response.data.success);
      } catch (error) {
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
    <div className="flex flex-col items-center space-y-4">
      {/* Loading Spinner */}
      <svg
        className="animate-spin h-12 w-12 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>

      {/* Loading Message */}
      <p className="text-lg font-semibold space-micro text-gray-700">Fetching your details...</p>
      <p className="text-sm space-micro text-gray-500">
        Please wait while we verify your information.
      </p>
    </div>
  </div>
  }

  return isValid ? <Navigate to="/home" /> : <Component />;
};

export default PublicRoute;
