import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tokenManager from "../../utils/tokenManager";
import BusinessDetailsCard from "../Dashboard/BusinessDetailsCard";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Building2, Edit, Plus } from "lucide-react";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SubmitOwnerData = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    compneyname: "",
    gstNumber: "",
    recipientName: "",
    houseNumber: "",
    streetName: "",
    locality: "",
    city: "",
    pinCode: "",
    state: "",
  });
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if owner data already exists
  useEffect(() => {
    checkExistingOwner();
  }, []);

  const checkExistingOwner = async () => {
    try {
      const token = tokenManager.getToken();
      const response = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.owner) {
        setOwnerData(response.data.owner);
      }
    } catch (error) {
      console.error("Error checking owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("BACKENDURL:", BACKENDURL);
    console.log("Sending data:", formData);
    try {
      const token = tokenManager.getToken();
      const result = await axios.post(
        `${BACKENDURL}/owners/insertownerdata`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Response:", result.data);
      toast.success(result.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      
      // Refresh owner data after successful registration
      await checkExistingOwner();
      
      // Redirect to dashboard after successful owner creation
      toast.success("Owner profile created successfully! Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If owner data exists, show business details card
  if (ownerData) {
    return (
      <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Business Details</h1>
            <p className="text-zinc-600">Your business information has been registered successfully.</p>
          </div>
          
          <BusinessDetailsCard 
            ownerData={ownerData} 
          />
          
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-zinc-200 hover:bg-zinc-50"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Show registration form if no owner data exists
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-zinc-900">Welcome to ITPARTNER! 🎉</CardTitle>
          <p className="text-sm text-zinc-600 mt-2">Let's set up your business profile to get started</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-xs">
              ✨ This is your first time here! Complete your business profile to access the full dashboard.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <InputField
              label="Company Name"
              name="compneyname"
              type="text"
              value={formData.compneyname}
              onChange={handleChange}
              required
            />
            <InputField
              label="GST Number"
              name="gstNumber"
              type="text"
              value={formData.gstNumber}
              onChange={handleChange}
              required
            />
            <InputField
              label="Recipient Name"
              name="recipientName"
              type="text"
              value={formData.recipientName}
              onChange={handleChange}
            />
            <InputField
              label="House/Flat Number"
              name="houseNumber"
              type="text"
              value={formData.houseNumber}
              onChange={handleChange}
            />
            <InputField
              label="Street Name"
              name="streetName"
              type="text"
              value={formData.streetName}
              onChange={handleChange}
            />
            <InputField
              label="Locality/Area"
              name="locality"
              type="text"
              value={formData.locality}
              onChange={handleChange}
            />
            <InputField
              label="City"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
            />
            <InputField
              label="PIN Code"
              name="pinCode"
              type="text"
              value={formData.pinCode}
              onChange={handleChange}
            />
            <InputField
              label="State"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleChange}
            />

            <Button
              type="submit"
              className="w-full text-white bg-zinc-900 hover:bg-zinc-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Register Now
            </Button>
          </form>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-zinc-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
    />
  </div>
);

export default SubmitOwnerData;