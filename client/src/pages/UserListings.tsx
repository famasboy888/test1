import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IListing } from "../types/listing/listing";
import { RootState } from "../types/signin/reduxSignIn";

export default function UserListings() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userListings, setUserListings] = useState<IListing[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getUserListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser?._id}`, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          return;
        }

        setUserListings(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    getUserListings();

    return () => controller.abort();
  }, [currentUser]);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-2xl text-center my-7">Your Listings</h1>
      <div className="grid grid-cols-1 gap-6">
        {userListings ? (
          userListings.map((userList) => (
            <div
              className="flex gap-4 mb-4 bg-gray-50 p-2 rounded justify-between"
              key={userList._id}
            >
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 border rounded overflow-hidden flex-shrink-0">
                  <img
                    src={userList.imageUrls[0]}
                    alt={userList.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <Link
                    to={`/listing/detail/${userList._id}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 truncate block"
                  >
                    {userList.name}
                  </Link>
                  <p className="mt-2 text-gray-600 line-clamp-2">
                    {userList.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>You do not have any listings yet.</p>
        )}
      </div>
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </main>
  );
}
