import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

interface PrivateRouteProps {
  element: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.post("/admin/validate/validate-token-admin", { token });
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

  if (isValid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Session Expired
          </h2>
          <p className="text-gray-600 mb-6">
            Your session has expired, please log in again to continue.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Render the protected component if the session is valid
  return <Component />;
};

export default PrivateRoute;
