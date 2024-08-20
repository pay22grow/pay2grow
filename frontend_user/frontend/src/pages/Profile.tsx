/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from "../axiosConfig"; 
import FileUpload from './FileUpload';
import toast, { Toaster } from "react-hot-toast";
import "./home.css";
import { customToastStyles } from '../toastStyles';
import Footer from "./Footer";
import {ref, getDownloadURL,uploadBytesResumable} from "firebase/storage";
import { storage } from "../firebase/config";
interface BankDetails {
  accNo: number;
  ifscCode: string;
  branch: string;
  payeeName: string;
}
interface UserResponse {
  success: boolean;
  message: string;
  user : User;
}
interface User {
  _id: string;
  balance: number;
  status: string;
  name: string;
  phoneNumber: number;
  email: string;
  uniqueInvitationCode: string;
  kycVerified: string;
  kyc: string;
  bankDetails: BankDetails;
  bankUpdateRequest: string;
}

const Profile: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [status, setStatus] = useState<string>("Inactive");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [invitationCode, setInvitationCode] = useState<string>("");
  const [kycVerified, setKycVerified] = useState<string>("");
  const [kycImage, setKycImage] = useState<string>("");
  const [showKycProof, setShowKycProof] = useState(false);
  const [showBankDetailsForm, setShowBankDetailsForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accNo: 0,
    ifscCode: "",
    branch: "",
    payeeName: "",
});
  const [, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [bankUpdateRequest, setBankUpdateRequest] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post<UserResponse>(`/user/details/getDetailsProfile`);
        if (response.data.success) {
          const { balance = 0, status = "Inactive", name = "", phoneNumber = 0, email = "", uniqueInvitationCode = "", kycVerified = "", kyc = "", bankDetails = {accNo: 0, ifscCode: "", branch: "", payeeName: ""}, bankUpdateRequest = "", _id = "" } = response.data.user;
          setBalance(balance);
          setStatus(status);
          setName(name);
          setEmail(email);
          setPhoneNumber(phoneNumber);
          setInvitationCode(uniqueInvitationCode);
          setKycVerified(kycVerified);
          setKycImage(kyc);
          setBankDetails(bankDetails);
          setBankUpdateRequest(bankUpdateRequest);
          setUserId(_id);
        } else {
          console.error("User details not found.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []);
  const uploadFileToStorage = async (file: File) => {
    toast.loading("Uploading KYC document to storage...", {style: customToastStyles});

    const timestamp = Date.now();
    const storageRef = ref(storage, `kyc-images/${userId}/kyc-doc-${timestamp}.jpg`);
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
        toast.error("Failed to upload KYC document!", {style:customToastStyles});
        setShowFileUpload(false);
      },
      () => {
        // When the upload is complete, retrieve the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          toast.dismiss();
          setFile(null);
          toast.success("KYC document uploaded successfully!", {style:customToastStyles});

          // Save the download URL in the state or send it to the backend for saving in the database
          setKycImage(downloadURL);

          // Example: Make an API call to save the URL and update KYC status
          updateKycStatus(downloadURL, "pending");
          setShowFileUpload(false);
          navigate("/profile");
        });
      }
    );
  };
  const updateKycStatus = async (downloadURL: string, kycVerified: string) => {
    try {
      const response = await axios.post("/user/details/updateKyc", {
        kyc: downloadURL,
        kycVerified: kycVerified,
      });
      if (response.data.success) {
        toast.success("KYC status updated to pending.");
      } else {
        toast.error("Failed to update KYC status.");
      }
    } catch (error) {
      console.error("Error updating KYC status:", error);
      toast.error("An error occurred while updating KYC status.");
    }
  };

  const handleUploadClick = () => {
    setShowFileUpload(true);
    setShowKycProof(false);  
    setShowBankDetailsForm(false);
  };
  const handleUpdateBankDetails = () => {
    setShowModal(true);
    setShowKycProof(false); 
    setShowBankDetailsForm(true);  
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowKycProof(false);
    setShowBankDetailsForm(false);
  };
  const handleViewKyc = () => {
    setShowModal(true);
    setShowKycProof(true);  
    setShowBankDetailsForm(false); 
  };

  const handleSubmitBankDetails = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!bankDetails.accNo || !bankDetails.ifscCode || !bankDetails.branch || !bankDetails.payeeName) {
      toast.error("Please fill out all fields.",{
        style: customToastStyles, 
      });
      return;
    }
    try {
      const bankDetailsObj = {
        bankDetails: bankDetails
      }
      await axios.post("/user/details/updateBankDetails", bankDetailsObj);
      setShowModal(false);
      toast.success("Bank details updated successfully.",{
        style: customToastStyles, 
      });
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Failed to update bank details.",{
        style: customToastStyles, 
      });
      setTimeout(() => {
        navigate("/profile")
      }, 1000);
    }
    setShowModal(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-4 md:p-6">
      {/* Header Section */}
      <Header />

      {/* Points and Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold space-micro text-gray-700 mb-2">Points</h3>
          <p className="text-2xl font-bold space-micro text-blue-500">{balance}</p>
        </div>
        <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-lg font-semibold space-micro text-gray-700 mb-2">Status</h3>
          <p className="text-2xl font-bold space-micro" style={{
              color: status === "Active" ? "green" : status === "Inactive" ? "orange" : status === "Blocked" ? "red" : "black"}}>{status}</p>
        </div>
      </div>

      {/* Personal Info and Bank Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Personal Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 space-micro mb-4">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
            <div className="flex flex-col">
              <span className="text-sm font-semibold space-micro text-gray-500 uppercase">Name</span>
              <p className="text-lg font-medium space-micro text-gray-800 mt-1">{name}</p>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold space-micro text-gray-500 uppercase">Phone</span>
              <p className="text-lg font-medium space-micro text-gray-800 mt-1">{phoneNumber}</p>
            </div>
            <div className="flex flex-col col-span-1 md:col-span-2">
              <span className="text-sm font-semibold space-micro text-gray-500 uppercase">Email</span>
              <p className="text-lg font-medium space-micro text-gray-800 mt-1">{email}</p>
            </div>
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold space-micro text-gray-700 mb-4">
            Bank Details
          </h3>
          <div className="space-y-2">
            {bankDetails.accNo ? (
              <p className="text-md space-micro">
              <strong>Account No:</strong> {bankDetails.accNo}
            </p>
            ) : (
              <></>
            )}
            {bankDetails.ifscCode ? (
                <p className="text-md space-micro">
                <strong>IFSC Code:</strong> {bankDetails.ifscCode}
              </p>
            ): (
                <></>
            )}
            {bankDetails.branch ? (
                <p className="text-md space-micro">
                <strong>Branch:</strong> {bankDetails.branch}
              </p>
            ) : (
              <></>
            )}
            {bankDetails.payeeName ? (
                <p className="text-md space-micro">
                <strong>Payee Name:</strong> {bankDetails.payeeName}
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-4">
            {bankUpdateRequest === 'approved' && (
              <p className=" text-xl font-bold space-micro text-green-500 ">Bank Details Approved</p>
            )}
            {bankUpdateRequest === 'pending' && (
              <p className="text-xl font-bold space-micro text-yellow-500">Bank Details Approval Pending</p>
            )}
            {bankUpdateRequest === 'rejected' && (
              <p className="text-xl font-bold space-micro text-red-500 ">Bank Details Invalid. Please update your bank details.</p>
            )}
          </div>
          <button
            onClick={handleUpdateBankDetails}
            className="mt-4 bg-yellow-500 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-yellow-600 transition w-full text-sm"
          >
            Update Bank Details
          </button>
        </div>
      </div>

      {/* KYC and Invite Friend Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6 text-center">
    <h3 className="text-lg font-semibold space-micro text-gray-700 mb-2">KYC Status</h3>
    {kycVerified === "verifyKyc" && (
      <>
        <button
          onClick={handleUploadClick}
          className="mt-2 bg-blue-500 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-blue-600 transition w-full text-sm"
        >
          Verify KYC
        </button>
        {/* Show FileUpload component when Verify KYC is clicked */}
        {showFileUpload && (
          <FileUpload
            onFileUpload={(file) => uploadFileToStorage(file)}
          />
        )}
      </>
    )}
    {kycVerified === "pending" && (
      <>
        <p className="text-2xl space-micro font-bold text-yellow-500">Pending</p>
        <button
          onClick={handleViewKyc}
          className="mt-2 bg-blue-500 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-blue-600 transition w-full text-sm"
        >
          View KYC
        </button>
      </>
    )}
    {kycVerified === "verified" && (
      <>
        <p className="text-2xl font-bold space-micro text-green-500">Verified</p>
        <button
          onClick={handleViewKyc}
          className="mt-2 bg-blue-500 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-blue-600 transition w-full text-sm"
        >
          View KYC
        </button>
      </>
    )}
    {kycVerified === "rejected" && (
      <>
        <p className="text-2xl font-bold space-micro text-red-500">Rejected</p>
        <button
          onClick={handleUploadClick}
          className="mt-2 bg-red-500 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-red-600 transition w-full text-sm"
        >
          Re-upload KYC
        </button>
        {/* Show FileUpload component when Re-upload KYC is clicked */}
        {showFileUpload && (
          <FileUpload
            onFileUpload={(file) => uploadFileToStorage(file)}
          />
        )}
      </>
    )}
  </div>
  <div className="bg-white bg-opacity-90 border border-gray-300 rounded-lg shadow-lg p-6 text-center">
    <h3 className="text-lg font-semibold space-micro text-gray-700 mb-2">
      Invite a Friend
    </h3>
    <p className="text-md mb-4 space-micro">
      Your Invitation Code:{" "}
      <strong className="text-blue-500 space-micro ">{invitationCode}</strong>
    </p>
    <button className="bg-purple-500 space-micro text-white rounded-lg py-2 px-4 shadow-lg hover:bg-purple-600 transition w-full text-sm">
      Invite Now
    </button>
  </div>
</div>

      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {showKycProof && (
          <>
            <h3 className="text-xl space-micro font-semibold text-gray-700 mb-4">
              Uploaded KYC Document
            </h3>
            <img 
              src={kycImage} 
              alt="KYC Proof" 
              style={{ width: "400px", height: "400px", objectFit: "contain" }} 
            />
            <button
              onClick={handleCloseModal}
              className="bg-gray-400 text-white space-micro rounded-lg py-2 px-4 shadow-lg hover:bg-gray-500 transition"
            >
              Close
            </button>
          </>
        )}
        {showBankDetailsForm && (
          <>
            <h3 className="text-xl font-semibold space-micro text-gray-700 mb-4">
              Update Bank Details
            </h3>
            <form onSubmit={handleSubmitBankDetails} className="space-y-4">
              <div>
                <label className="block space-micro font-semibold text-gray-700">
                  Account No
                </label>
                <input
                  type="number"
                  value={bankDetails.accNo}
                  onChange={(e) => setBankDetails({...bankDetails, accNo: parseInt(e.target.value)})}
                  className="w-full border space-micro border-gray-300 rounded-lg p-2 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block font-semibold space-micro text-gray-700">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                  className="w-full border border-gray-300 space-micro rounded-lg p-2 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block font-semibold space-micro text-gray-700">
                  Branch
                </label>
                <input
                  type="text"
                  value={bankDetails.branch}
                  onChange={(e) => setBankDetails({...bankDetails, branch: e.target.value})}
                  className="w-full border space-micro border-gray-300 rounded-lg p-2 bg-white text-gray-700"
                />
              </div>
              <div>
                <label className="block font-semibold space-micro text-gray-700">
                  Payee Name
                </label>
                <input
                  type="text"
                  value={bankDetails.payeeName}
                  onChange={(e) => setBankDetails({...bankDetails, payeeName: e.target.value})}
                  className="w-full border space-micro border-gray-300 rounded-lg p-2 bg-white text-gray-700"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 bg-gray-400 space-micro text-white rounded-lg py-2 px-4 shadow-lg hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 space-micro text-white rounded-lg py-2 px-4 shadow-lg hover:bg-green-600 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )}
    <Toaster position="top-center" />
    <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
