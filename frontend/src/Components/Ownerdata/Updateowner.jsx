import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import BusinessDetailsCard from "../Dashboard/BusinessDetailsCard";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Building2, Edit, Save, ArrowLeft } from "lucide-react";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UpdateOwner = () => {
  const navigate = useNavigate();
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    compneyname: "",
    address: "",
    gstNumber: "",
  });

  // Fetch current owner data
  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BACKENDURL}/owners/myowner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.owner) {
        setOwnerData(response.data.owner);
        setFormData({
          name: response.data.owner.name || "",
          email: response.data.owner.email || "",
          phone: response.data.owner.phone || "",
          compneyname: response.data.owner.compneyname || "",
          address: response.data.owner.address || "",
          gstNumber: response.data.owner.gstNumber || "",
        });
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
      toast.error("Failed to load owner data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: ownerData.name || "",
      email: ownerData.email || "",
      phone: ownerData.phone || "",
      compneyname: ownerData.compneyname || "",
      address: ownerData.address || "",
      gstNumber: ownerData.gstNumber || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = Cookies.get('token');
      const response = await axios.put(
        `${BACKENDURL}/owners/updateowner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success("Owner details updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
      
      // Refresh owner data
      await fetchOwnerData();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating owner:", err);
      toast.error(err.response?.data?.message || "Error updating owner details", {
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

  if (!ownerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">No Business Details Found</h2>
            <p className="text-zinc-600 mb-6">You need to register your business details first.</p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/submitownerdata')}
                className="w-full bg-zinc-900 hover:bg-zinc-800"
              >
                Register Business
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="w-full border-zinc-200 hover:bg-zinc-50"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-zinc-200 hover:bg-zinc-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Update Business Details</h1>
          <p className="text-zinc-600">Modify your business information</p>
        </div>

        {isEditing ? (
          // Edit Form
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-zinc-900">Edit Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    label="Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="bg-zinc-900 hover:bg-zinc-800"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-zinc-200 hover:bg-zinc-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Display Business Details Card
          <div>
            <BusinessDetailsCard 
              ownerData={ownerData} 
              onEdit={handleEdit}
            />
          </div>
        )}
      </div>
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

export default UpdateOwner;
