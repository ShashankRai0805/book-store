import { store } from '../store';
import { logout } from '../store/auth';

// Function to handle authentication errors and logout
export const handleAuthError = () => {
  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  
  // Dispatch logout action to Redux store
  store.dispatch(logout());
  
  // Show alert to user
  alert("Session expired. Please login again.");
  
  // Redirect to login page
  window.location.href = "/login";
};

// Function to check if error is authentication related
export const isAuthError = (error) => {
  return (
    error.response?.status === 401 || 
    error.response?.data?.msg?.includes("Token verification failed") ||
    error.response?.data?.msg?.includes("invalid signature") ||
    error.response?.data?.msg?.includes("jwt expired") ||
    error.response?.data?.msg?.includes("JsonWebTokenError") ||
    error.response?.data?.msg?.includes("Unauthorized")
  );
};
