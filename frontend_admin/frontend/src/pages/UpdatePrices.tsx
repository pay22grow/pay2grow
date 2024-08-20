import { useState, useEffect } from "react";
import axios from "../axiosConfig";
import "./home.css";
import Header from "./Header";
import Footer from "./Footer";
import toast, { Toaster } from "react-hot-toast";
import { customToastStyles } from '../toastStyles';
const UpdatePrices = () => {
  const [formValues, setFormValues] = useState({
    todaysRate: "",
    wazirXRate: "",
    binanceRate: "",
    kuCoinRate: "",
    todaysBuyPrice: "",
    todaysSellPrice: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get("/admin/edit/getPrices");
        const prices = response.data.setPrices;

        if (prices) {
          setFormValues({
            todaysRate: prices.todaysRate || "",
            wazirXRate: prices.wazirXRate || "",
            binanceRate: prices.binanceRate || "",
            kuCoinRate: prices.kuCoinRate || "",
            todaysBuyPrice: prices.todaysBuyPrice || "",
            todaysSellPrice: prices.todaysSellPrice || "",
          });
        }
      } catch (error) {
        toast.error("Error fetching current prices.",{
            style: customToastStyles, 
          });
        setError("Error fetching current prices.");
      }
    };

    fetchPrices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/edit/setPrices", formValues);
      if (response.data.message) {
        setSuccess(response.data.message);
        toast.success("Prices updated successfully.",{
            style: customToastStyles, 
          });
      }
    } catch (error) {
      toast.error("Error updating prices",{
        style: customToastStyles, 
      });
      setError("Error updating prices.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-6">
        <Header />
      <div className="bg-white bg-opacity-70 border border-gray-300 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 space-micro text-gray-800">Update Prices</h1>

        {error && <p className="text-red-500 space-micro mb-4">{error}</p>}
        {success && <p className="text-green-500 space-micro mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Today's Rate", name: "todaysRate" },
            { label: "WazirX Rate", name: "wazirXRate" },
            { label: "Binance Rate", name: "binanceRate" },
            { label: "KuCoin Rate", name: "kuCoinRate" },
            { label: "Today's Buy Price", name: "todaysBuyPrice" },
            { label: "Today's Sell Price", name: "todaysSellPrice" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 space-micro">{field.label}</label>
              <input
                type="number"
                name={field.name}
                value={formValues[field.name as keyof typeof formValues]}
                onChange={handleInputChange}
                className="w-full p-3 border space-micro border-gray-300 rounded"
                placeholder={`Enter ${field.label}`}
              />
            </div>
          ))}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 space-micro rounded hover:bg-blue-600 transition duration-300"
            >
              Update Prices
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-center"/>
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
};

export default UpdatePrices;
