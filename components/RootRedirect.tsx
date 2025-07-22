import { Navigate } from "react-router-dom";
import Home from "./Home";
import { auth } from "../firebase";

/**
 * When the app loads, check:
 *  • A Firebase user object exists          (auth.currentUser)
 *  • A matching session is stored locally   (localStorage.userSession)
 *
 * Both are required because you already write user data to
 * localStorage in Navbar and Dashboard [1][2].
 *
 * If they exist -> go to /dashboard
 * Otherwise     -> stay on Home (root page)
 */
const RootRedirect: React.FC = () => {
  const hasSession = Boolean(localStorage.getItem("userSession"));
  const isLoggedIn = Boolean(auth.currentUser);

  if (hasSession && isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
};

export default RootRedirect;
