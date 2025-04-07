import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IListing } from "../types/listing/listing";
import { RootState } from "../types/signin/reduxSignIn";

export default function ListingDetail() {
  SwiperCore.use([Navigation, Pagination]);

  const navigator = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const [listing, setListing] = useState<IListing>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || id === "") {
      navigator("/not-found");
      return;
    }

    const controller = new AbortController();

    const getListingDetail = async () => {
      setLoading(true);
      setError("");
      setListing(undefined);
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
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getListingDetail();

    return () => controller.abort();
  }, [id, currentUser, navigator]);

  const handleDeleteListing = async () => {
    try {
      const res = await fetch(`/api/user/listing/delete/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userRef: currentUser?._id }),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigator("/user/listings");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {listing && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      {currentUser?._id === listing?.userRef && (
        <div>
          <button
            onClick={handleDeleteListing}
            className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => navigator(`/listing/update/${id}`)}
            className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
          >
            Edit
          </button>
        </div>
      )}
      {error && <p className="text-center my-7 text-2xl">{error}</p>}
    </main>
  );
}
