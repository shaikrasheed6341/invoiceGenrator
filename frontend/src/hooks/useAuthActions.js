import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAuthActions = () => {
  const { login, logout, refreshOwnerData, hasOwnerData } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (result.hasOwner) {
          toast.success("🎉 Successfully Logged In! Redirecting to dashboard...", {
            position: "top-right",
            autoClose: 2000,
            theme: "dark",
          });
          return { success: true, hasOwner: true };
        } else {
          // User logged in but needs to complete business profile
          toast.success("✅ Login successful! Please complete your business profile.", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
          });
          return { success: true, hasOwner: false };
        }
      } else {
        toast.error(result.error || "❌ Invalid Credentials", {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error("❌ Login failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
      return { success: false, error: "Login failed" };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("👋 Successfully logged out", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      navigate("/");
    }
  };

  const handleRefreshData = async () => {
    try {
      const success = await refreshOwnerData();
      if (success) {
        toast.success("✅ Data refreshed successfully", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        toast.error("❌ Failed to refresh data", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
      return success;
    } catch (error) {
      toast.error("❌ Error refreshing data", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return false;
    }
  };

  const checkAuthAndRedirect = (redirectTo = "/dashboard") => {
    if (!hasOwnerData()) {
      toast.warning("⚠️ Please complete your business profile first", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      navigate("/submitownerdata");
      return false;
    }
    navigate(redirectTo);
    return true;
  };

  return {
    handleLogin,
    handleLogout,
    handleRefreshData,
    checkAuthAndRedirect,
    hasOwnerData
  };
};
