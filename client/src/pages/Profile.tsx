import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types/signin/reduxSignIn";

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useSelector(
    (state: RootState) => state.user || { loading: false, error: null }
  );
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    console.log(file);
  }, [file]);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 p-0 border-none bg-transparent"
        >
          <img
            src={currentUser?.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </button>
        <input
          id="userrname"
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
        />
        <input
          id="email"
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          id="password"
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-85 cursor-pointer">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
