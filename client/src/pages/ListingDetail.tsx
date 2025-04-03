import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IListing } from "../types/listing/listing";
import { RootState } from "../types/signin/reduxSignIn";

export default function ListingDetail() {
  const navigator = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const [listing, setListing] = useState<IListing>();
  const [error, setError] = useState("");

  console.log(listing);

  useEffect(() => {
    if (!id || id === "") {
      navigator("/not-found");
      return;
    }

    const controller = new AbortController();

    const getListingDetail = async () => {
      try {
        console.log(
          "data:",
          `/api/user/listing/detail?${id}`,
          currentUser?._id
        );

        const params = new URLSearchParams();

        params.set("listingId", id);
        params.set("userRef", currentUser?._id ?? "");

        const res = await fetch(
          `/api/user/listing/detail?${params.toString()}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        const data = await res.json();

        if (data.success === false) {
          navigator("/not-found");
          return;
        }

        setListing(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    getListingDetail();

    return () => controller.abort();
  }, [id, currentUser, navigator]);

  return (
    <div>
      {currentUser?._id === listing?.userRef && (
        <div>
          <button className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer">
            Delete
          </button>
          <button className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
