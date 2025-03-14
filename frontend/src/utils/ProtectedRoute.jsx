export function ProtectedRoute({ children, allowedRoles }) {
  const userRole = sessionStorage.getItem("role");

  if (!userRole || !allowedRoles.includes(userRole)) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("displayname");
    sessionStorage.removeItem("role");
  }

  return children;
}
