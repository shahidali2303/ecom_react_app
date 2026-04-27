import { Navigate, Outlet } from "react-router-dom";
import useStore from "../store/useStore";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // If not logged in, send them to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If 'children' exists (passed via prop), render it.
  // Otherwise, render 'Outlet' (for nested route structures).
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
