import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../types/signin/reduxSignIn";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser } = useSelector(
    (state: RootState) => state.user || { loading: false, error: null }
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") ?? "";

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex mx-auto justify-between items-center max-w-6xl p-3">
        <Link to="/" className="text-slate-700 hover:underline">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Realty</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSearchSubmit}
        >
          <input
            value={searchTerm}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button className="cursor-pointer p-2 rounded-lg hover:bg-slate-300 transition duration-200 ease-in-out">
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/" className="text-slate-700 hover:underline">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about" className="text-slate-700 hover:underline">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          {currentUser ? (
            <Link to="/profile">
              <img
                src={currentUser?.avatar}
                alt="profile"
                className="rounded-full h-7 w-7 object-cover"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </Link>
          ) : (
            <Link to="/sign-in" className="text-slate-700 hover:underline">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign In
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
