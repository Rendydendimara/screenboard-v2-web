import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Admin() {
  // Redirect to dashboard by default
  return <Navigate to="/admin/dashboard" replace />;
}
