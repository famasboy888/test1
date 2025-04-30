import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ListingCardComponent from "../components/ListingCardComponent";
import { IListing } from "../types/listing/listing";

export default function Home() {
  SwiperCore.use([Navigation, Pagination]);
  const [offerListings, setOfferListings] = useState<IListing[]>([]);
  const [saleListings, setSaleListings] = useState<IListing[]>([]);
  const [rentListings, setRentListings] = useState<IListing[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOfferListing = async () => {
      try {
        setLoading(true);
        setError("");

        const [offerRes, saleRes, rentRes] = await Promise.all([
          fetch(`/api/listing/get-listings?offer=true&limit=4`, {
            signal: controller.signal,
          }),
          fetch(`/api/listing/get-listings?listingType=rent&limit=4`, {
            signal: controller.signal,
          }),
          fetch(`/api/listing/get-listings?listingType=sale&limit=4`, {
            signal: controller.signal,
          }),
        ]);

        const offerData = await offerRes.json();
        const saleData = await saleRes.json();
        const rentData = await rentRes.json();

        if (offerData.success === false) {
          setError(offerData.message);
        }

        if (saleData.success === false) {
          setError(saleData.message);
        }

        if (rentData.success === false) {
          setError(rentData.message);
        }

        setOfferListings(offerData);
        setSaleListings(saleData);
        setRentListings(rentData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOfferListing();
    return () => controller.abort();
  }, []);

  return (
    <main>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next place!
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          At Realty Estate, we believe finding your perfect home should feel as
          comforting as your favorite cup of tea — warm, inviting, and just
          right. Whether you're buying, selling, or just exploring, our platform
          is designed to make real estate feel personal, simple, and
          refreshingly honest. <br />
          We offer a curated selection of beautiful properties, insightful
          resources, and friendly guidance every step of the way. From
          countryside cottages to modern city lofts, your next chapter begins
          here — with transparency, trust, and a touch of Realtea charm.
        </div>
        <Link
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline cursor-pointer"
          to="search"
        >
          Get Started
        </Link>
      </div>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {!loading && (
        <>
          <div>
            <Swiper navigation pagination>
              {offerListings &&
                offerListings.length > 0 &&
                offerListings.map((offerListing) => (
                  <SwiperSlide key={offerListing._id}>
                    <div
                      className="h-[500px]"
                      style={{
                        background: `url(${offerListing.imageUrls[0]}) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
            {offerListings && offerListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">
                    Recent Offers
                  </h2>
                  <Link
                    className="text-sm text-blue-800 hover:underline"
                    to={"/search?offer=true"}
                  >
                    Show More Offers
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {offerListings.map((offerListing) => (
                    <ListingCardComponent
                      listing={offerListing}
                      key={offerListing._id}
                    />
                  ))}
                </div>
              </div>
            )}
            {rentListings && rentListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">
                    Recent Places for Rent
                  </h2>
                  <Link
                    className="text-sm text-blue-800 hover:underline"
                    to={"/search?listingType=rent"}
                  >
                    Show More Rent
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {rentListings.map((rentListing) => (
                    <ListingCardComponent
                      listing={rentListing}
                      key={rentListing._id}
                    />
                  ))}
                </div>
              </div>
            )}
            {saleListings && saleListings.length > 0 && (
              <div className="">
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">
                    Recent Places for Sale
                  </h2>
                  <Link
                    className="text-sm text-blue-800 hover:underline"
                    to={"/search?listingType=sale"}
                  >
                    Show More for Sale
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {saleListings.map((saleListing) => (
                    <ListingCardComponent
                      listing={saleListing}
                      key={saleListing._id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </main>
  );
}
