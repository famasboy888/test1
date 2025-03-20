import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../types/signin/reduxSignIn";

export default function Header() {
  const { currentUser } = useSelector(
    (state: RootState) => state.user || { loading: false, error: null }
  );
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
          action=""
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
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
