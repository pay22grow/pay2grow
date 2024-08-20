/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import Header from "./Header";
import axios from "../axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";
import { customToastStyles } from '../toastStyles';
import Footer from "./Footer";
import {ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/config";
import FileUpload from "./FileUpload";
interface UserResponse {
  success: boolean;
  message: string;
  user: {
    status: string;
    kycVerified: string;
    bankUpdateRequest: string;
    _id : string;
  };
}


const RechargePage: React.FC = () => {
  const [buyPoints, setBuyPoints] = useState<number | "">("");
  const [receivePoints, setReceivePoints] = useState<number | "">("");
  const [usdtAmount, setUsdtAmount] = useState<number | "">("");
  const [profit, setProfit] = useState<number | "">("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [prices, setPrices] = useState({
    todayPrice: "",
    buyPrice: "",
    sellPrice: "",
  });
  const [rechargeAddress, setRechargeAddress] = useState<string>("");
  const [qrImage, setQrImage] = useState<string>("");
  const [rechargeProof, setRechargeProof] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [kycVerified, setKycVerified] = useState<string | null>(null);
  const [bankUpdateRequest, setBankUpdateRequest] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post<UserResponse>("/user/details/getDetails");

        if (response.data.success) {
          setUserStatus(response.data.user.status);
          setKycVerified(response.data.user.kycVerified);
          setBankUpdateRequest(response.data.user.bankUpdateRequest);
          setUserId(response.data.user._id);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchPrices = async () => {
      try {
        const response = await axios.get("/admin/edit/getPrices");
        const prices = response.data.setPrices;

        if (prices) {
          setPrices({
            todayPrice: prices.todaysRate,
            buyPrice : prices.todaysBuyPrice,
            sellPrice: prices.todaysSellPrice
          });
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };
    const fetchRechargeAddress = async () => {
      try {
        const response = await axios.get("/admin/recharge/address/recharge-address");
        const addressData = response.data;

        if (addressData) {
          setRechargeAddress(addressData.address);
          setQrImage(addressData.image); 
        }
      } catch (error) {
        console.error("Error fetching recharge address:", error);
      }
    };
    fetchPrices();
    fetchRechargeAddress();
    fetchUserDetails();
  }, []);

  const sellPrice = useMemo(() => parseFloat(prices.sellPrice), [prices.sellPrice]);
  const buyPrice = useMemo(() => parseFloat(prices.buyPrice), [prices.buyPrice]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const handleBuyPointsChange = (value: number) => {
    if (isNaN(value) || value <= 0) {
      setBuyPoints("");
      setReceivePoints("");
      setUsdtAmount("");
      setProfit("");
      return;
    }
    const receive = value * (sellPrice / buyPrice);
    const usdt = value / buyPrice;
    const prof = receive - value;

    setBuyPoints(value);
    setReceivePoints(parseFloat(receive.toFixed(2)));
    setUsdtAmount(parseFloat(usdt.toFixed(2)));
    setProfit(parseFloat(prof.toFixed(2)));
  };

  const handleReceivePointsChange = (value: number) => {
    const buy = value * (buyPrice / sellPrice);
    const usdt = buy / buyPrice;
    const prof = value - buy;

    setReceivePoints(value);
    setBuyPoints(parseFloat(buy.toFixed(2)));
    setUsdtAmount(parseFloat(usdt.toFixed(2)));
    setProfit(parseFloat(prof.toFixed(2)));
  };

  const handleUsdtAmountChange = (value: number) => {
    const buy = value * buyPrice;
    const receive = buy * (sellPrice / buyPrice);
    const prof = receive - buy;

    setUsdtAmount(value);
    setBuyPoints(parseFloat(buy.toFixed(2)));
    setReceivePoints(parseFloat(receive.toFixed(2)));
    setProfit(parseFloat(prof.toFixed(2)));
  };

  const handleProfitChange = (value: number) => {
    const buy = value / (sellPrice / buyPrice - 1);
    const receive = buy * (sellPrice / buyPrice);
    const usdt = buy / buyPrice;

    setProfit(value);
    setBuyPoints(parseFloat(buy.toFixed(2)));
    setReceivePoints(parseFloat(receive.toFixed(2)));
    setUsdtAmount(parseFloat(usdt.toFixed(2)));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rechargeAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  const uploadFileToStorage = async (file: File) => {
    toast.loading("Uploading Recharge Proof to storage...", {
      style:customToastStyles
    });

    const timestamp = Date.now();
    const storageRef = ref(storage, `recharge-proofs/${userId}/recharge-proofs-${timestamp}.jpg`);
    // Start the file upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor the upload task progress
    uploadTask.on(
      "state_changed",
      (_snapshot: any) => {
        // You can track upload progress here if needed
      },
      (error: any) => {
        console.error(error);
        toast.dismiss();
        toast.error("Failed to upload recharge proof!", {style:customToastStyles});
        setShowFileUpload(false);
      },
      () => {
        // When the upload is complete, retrieve the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          toast.dismiss();
          setFile(null);
          toast.success("Recharge Proof uploaded successfully!", {
            style:customToastStyles
          });

          // Save the download URL in the state or send it to the backend for saving in the database
          setRechargeProof(downloadURL);
          setShowFileUpload(false);
        });
      }
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  // Check if rechargeProof is available before proceeding
  if (!rechargeProof || rechargeProof === "") {
    toast.error("Please upload a recharge proof first.", { style: customToastStyles });
    return;
  }
    if (buyPoints && receivePoints && usdtAmount && profit && rechargeProof) {
      setShowPopup(true);
    }
    else {
      toast.error("Please fill in all required fields and upload a recharge proof.",{
        style: customToastStyles, 
      });
    }
  };
  const handleUploadClick = () => {
    setShowFileUpload(true);
  };
  const confirmSubmission = async () => {
      try {
          const formData = new FormData();
          formData.append("buyPoints", buyPoints.toString());
          formData.append("receivePoints", receivePoints.toString());
          formData.append("needToPayUSDT", usdtAmount.toString());
          formData.append("profit", profit.toString());
          formData.append("buyPrice", buyPrice.toString());
          formData.append("sellPrice", sellPrice.toString());
          if (rechargeProof) {
              formData.append("rechargeProof", rechargeProof);
          }

          // Submit the recharge request
          const response = await axios.post("/user/recharge/createRecharge", formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });
          if (response.status === 429) {
            toast.error("Too many requests. Please try again after 1 minute.",{
              style: customToastStyles, 
            });
            return;
          }
          console.log(response);
          if (response.data.success) {
              toast.success("Recharge created succedfully",{
                style: customToastStyles, 
              });
              const updateResponse = await axios.post("/user/details/updatePending", {
                  receivePoints: receivePoints,
              });

              if (updateResponse.data.success) {
                  toast.success("Recharge and pending points updated successfully.",{
                    style: customToastStyles, 
                  });
                  setShowPopup(false);
                  setBuyPoints("");
                  setReceivePoints("");
                  setUsdtAmount("");
                  setProfit("");
                  setRechargeProof("");
              } else {
                  toast.error("Failed to update pending points.",{
                    style: customToastStyles, 
                  });
              }
          } else {
              toast.error("Failed to submit recharge request.",{
                style: customToastStyles, 
              });
          }
        } catch (error) {
          console.error("Error submitting recharge request:", error);
      
          // Check if error is an instance of Error and has a response property
          if (error && (error as any).response && (error as any).response.status) {
              const status = (error as any).response.status;
              if (status === 429) {
                toast.error("Too many requests. Please try again after 1 minute.",{
                  style: customToastStyles, 
                });
              } else {
                toast.error("Failed to submit recharge request.",{
                  style: customToastStyles, 
                });
              }
          } else {
            toast.error("An unexpected error occurred. Please try again later.",{
              style: customToastStyles, 
            });
          }
      }
      
    };
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
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
            <p className="text-sm text-gray-500">
              Please wait while we verify your information.
            </p>
          </div>
        </div>
      );
    }    
    if (userStatus !== "Active" || kycVerified !== "verified") {
      return (
        <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
        <Header />
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
          <div className="text-center bg-white p-4 rounded-lg mb-60 shadow-lg">
            <h2 className="text-xl font-bold space-micro text-red-600">Verification Pending</h2>
            <p className="text-gray-700 space-micro mt-2">
              Your account status is <strong>{userStatus}</strong> and KYC status is{" "}
              <strong>{kycVerified}</strong>. It may take up to 24 hours for the admin to verify
              your account and KYC. Please wait until your status is updated.
            </p>
            <button
            onClick={() => window.location.href = '/home'} 
            className="mt-4 bg-blue-600 space-micro text-white p-2 rounded shadow hover:bg-blue-700 transition"
          >
            Return to Home Page
          </button>
          </div>
        </div>
        <Footer />
        </div>
      );
    } 
    // Check for bank update request conditions
    if (bankUpdateRequest === "uploadBankDetails") {
      return (
        <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
        <Header />
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
          <div className="text-center bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold space-micro text-red-600">Bank Details Required</h2>
            <p className="text-gray-700 space-micro mt-2">
              You have not uploaded your bank details. Please upload your bank details to proceed with
              the recharge.
            </p>
          </div>
        </div>
        <Footer />
        </div>
      );
    }
  
    if (bankUpdateRequest === "rejected") {
      return (
        <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
          <Header />
          <div className="text-center bg-white mt-60 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold space-micro text-red-600">Bank Details Rejected</h2>
            <p className="text-gray-700 space-micro mt-2">
              Your bank details were rejected. Please update your bank details before proceeding with
              the recharge.
            </p>
          </div>
          <Footer />
        </div>
      );
    }
  if(kycVerified==="verified" && userStatus==="Active"){
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
        <Header />
        {bankUpdateRequest === "pending" && (
                <div className="text-center bg-yellow-100 p-4 rounded-lg shadow-lg mb-6">
                  <h2 className="text-lg font-bold space-micro text-yellow-600">Bank Details Update Pending</h2>
                  <p className="text-gray-700 space-micro mt-2">
                    Your bank details update request is pending. This may delay the processing of your
                    recharge.
                  </p>
                </div>
        )}
        <div className="bg-white w-full bg-opacity-80 border border-gray-300 rounded-lg shadow-lg p-4 md:p-6">
          <h2 className="text-xl space-micro md:text-2xl space-micro font-bold text-center mb-6 text-blue-600">
            Today Rate:
            <div className="flex flex-col md:flex-row justify-center mt-2 space-x-6">
              <span className="text-lg space-micro md:text-xl space-micro text-gray-700">
                Buy: <span className="text-green-600 font-semibold">{formatNumber(buyPrice)} Rs</span>
              </span>
              <span className="text-lg space-micro md:text-xl space-micro text-gray-700">
                Sell: <span className="text-red-600 font-semibold">{formatNumber(sellPrice)} Rs</span>
              </span>
            </div>
          </h2>
  
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 space-micro gap-4 md:gap-6"
          >
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm space-micro font-bold mb-1">
                  Buy Points (INR):
                </label>
                <input
                  type="text"
                  value={buyPoints ? formatNumber(buyPoints) : ""}
                  onChange={(e) =>
                    handleBuyPointsChange(
                      parseFloat(e.target.value.replace(/,/g, ""))
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm space-micro font-bold mb-1">
                  Receive Points (INR):
                </label>
                <input
                  type="text"
                  value={receivePoints ? formatNumber(receivePoints) : ""}
                  onChange={(e) =>
                    handleReceivePointsChange(
                      parseFloat(e.target.value.replace(/,/g, ""))
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm space-micro font-bold mb-1">
                  Need to pay USDT:
                </label>
                <input
                  type="text"
                  value={usdtAmount ? formatNumber(usdtAmount) : ""}
                  onChange={(e) =>
                    handleUsdtAmountChange(
                      parseFloat(e.target.value.replace(/,/g, ""))
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm space-micro font-bold mb-1">
                  Profit (INR):
                </label>
                <input
                  type="text"
                  value={profit ? formatNumber(profit) : ""}
                  onChange={(e) =>
                    handleProfitChange(
                      parseFloat(e.target.value.replace(/,/g, ""))
                    )
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <p className="font-bold space-micro">Pay only USDT on TRON Network:</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold space-micro break-words">
                    {rechargeAddress}
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`bg-gray-300 p-2 rounded ${
                      isCopied ? "bg-green-300" : ""
                    }`}
                  >
                    {isCopied ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
              {qrImage && (
                <div className="flex justify-center items-center">
                  <img
                    src={qrImage}
                    alt="QR Code"
                    className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm space-micro space-micro font-bold mb-1">
                  Recharge Proof (upload image):
                </label>
                <button
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleUploadClick();
                  }}
                  className="mt-2 mb-2 bg-blue-500 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-blue-600 transition w-full text-sm"
                >
                  Upload Proof
                </button>
                {showFileUpload && (
                    <FileUpload
                      onFileUpload={(file) => uploadFileToStorage(file)}
                    />
                  )}
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="mt-4 w-full space-micro bg-blue-600 text-white p-2 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* Confirmation Popup */}
        {showPopup && (
          <>
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                  <p className="text-lg font-bold space-micro mb-4">Confirm Submission</p>
                  <p className="mb-4 space-micro">
                    You are about to submit a recharge request. Please confirm by clicking the button below.
                  </p>
                  <button
                    onClick={confirmSubmission}
                    className="bg-green-600 text-white space-micro p-2 rounded shadow hover:bg-green-700 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="ml-4 bg-red-600 text-white p-2 space-micro rounded shadow hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
      <Toaster position="top-center" />
      <div className="mt-10">
        <Footer />
      </div>
      </div>
    );
  }  
};

export default RechargePage;
