import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import CreateListing from "./pages/CreateListing";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import NotFound from "./pages/not-found/NotFound";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UpdateListing from "./pages/UpdateListing";
import UserListings from "./pages/UserListings";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/user/listings" element={<UserListings />} />
          <Route path="/listing/detail/:id" element={<ListingDetail />} />
          <Route path="/listing/update/:id" element={<UpdateListing />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
