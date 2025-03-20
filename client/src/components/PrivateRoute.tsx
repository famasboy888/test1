import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../types/signin/reduxSignIn";

export default function PrivateRoute() {
  const { currentUser } = useSelector(
    (state: RootState) => state.user || { loading: false, error: null }
  );

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
