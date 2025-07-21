import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import BusinessDetailsCard from "../Dashboard/BusinessDetailsCard";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Building2, Edit, Save, ArrowLeft, CheckCircle } from "lucide-react";

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
      
      toast.success("Business details updated successfully!", {
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
      toast.error(err.response?.data?.message || "Error updating business details", {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600 text-sm">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">No Business Details Found</h2>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">You need to register your business details first to access this feature.</p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/submitownerdata')}
                className="w-full bg-zinc-900 hover:bg-zinc-800 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-zinc-200 hover:bg-zinc-50 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Business Details</h1>
            <p className="text-zinc-500 text-sm">Manage and update your business information</p>
          </div>
        </div>

        {isEditing ? (
          // Edit Form
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-zinc-600 to-zinc-800 rounded-lg flex items-center justify-center shadow-sm">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">Edit Business Details</CardTitle>
                  <p className="text-xs text-zinc-500 mt-1">Update your business information</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
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
                    label="Business Address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-zinc-700 to-zinc-900 text-white hover:from-zinc-800 hover:to-zinc-950 shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="border-zinc-200 hover:bg-zinc-50 shadow-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          // Display Business Details Card
          <div className="space-y-6">
            <BusinessDetailsCard 
              ownerData={ownerData} 
              onEdit={handleEdit}
            />
            
            {/* Additional Info Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 mb-1">Last Updated</h3>
                    <p className="text-xs text-zinc-500">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 mb-1">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
    />
  </div>
);

export default UpdateOwner;
