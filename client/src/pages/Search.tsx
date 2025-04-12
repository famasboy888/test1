import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCardComponent from "../components/ListingCardComponent";
import { IListing } from "../types/listing/listing";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarSearchData, setSidebarSearchData] = useState({
    searchTerm: "",
    listingType: "all",
    parking: false,
    furnished: false,
    offer: false,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMore, setShowMore] = useState(false);

  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const listingType = urlParams.get("listingType") || "all";
    const parking = urlParams.get("parking") === "true";
    const furnished = urlParams.get("furnished") === "true";
    const offer = urlParams.get("offer") === "true";
    const sortBy = urlParams.get("sortBy") || "createdAt";
    const sortOrder = urlParams.get("sortOrder") || "desc";

    setSidebarSearchData({
      searchTerm,
      listingType,
      parking,
      furnished,
      offer,
      sortBy,
      sortOrder,
    });

    const controller = new AbortController();

    const fetchListings = async () => {
      const searchQuery = urlParams.toString();
      try {
        setLoading(true);
        setError("");
        setShowMore(false);
        const res = await fetch(`/api/listing/get-listings?${searchQuery}`, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await res.json();
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();

    return () => controller.abort();
  }, [location.search]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarSearchData((prev) => ({
        ...prev,
        listingType: e.target.id,
      }));
    }

    if (e.target.id === "searchTerm") {
      setSidebarSearchData((prev) => ({
        ...prev,
        searchTerm: e.target.value,
      }));
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarSearchData((prev) => ({
        ...prev,
        [e.target.id]: (e.target as HTMLInputElement).checked,
      }));
    }

    if (e.target.id === "sort_order") {
      setSidebarSearchData((prev) => ({
        ...prev,
        sortBy: e.target.value.split("_")[0] || "createdAt",
        sortOrder: e.target.value.split("_")[1] || "desc",
      }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const urlParams = new URLSearchParams();

      urlParams.append("searchTerm", sidebarSearchData.searchTerm);
      urlParams.append("listingType", sidebarSearchData.listingType);
      urlParams.append("parking", sidebarSearchData.parking.toString());
      urlParams.append("furnished", sidebarSearchData.furnished.toString());
      urlParams.append("offer", sidebarSearchData.offer.toString());
      urlParams.append("sortBy", sidebarSearchData.sortBy);
      urlParams.append("sortOrder", sidebarSearchData.sortOrder);
      const queryString = urlParams.toString();
      navigate(`/search?${queryString}`);
    } catch (error) {
      console.error("Error while searching listings:", error);
    }
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings?.length;
    const startIndex = numberOfListings ? numberOfListings : 0;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex.toString());
    const searchQuery = urlParams.toString();

    const controller = new AbortController();

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/listing/get-listings?${searchQuery}`, {
        method: "GET",
        signal: controller.signal,
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }

      if (data.length < 9) {
        setShowMore(false);
      }
      setListings((prev) => [...prev, ...data]);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setError(error.message);
      }
    } finally {
      setLoading(false);
      controller.abort();
    }
  };

  return (
    <main>
      <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap" htmlFor="searchTerm">
                Search listing:
              </label>
              <input
                className="border rounded-lg p-3 w-full"
                type="text"
                id="searchTerm"
                placeholder="Search..."
                value={sidebarSearchData.searchTerm}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="all">Type:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5"
                  onChange={handleInputChange}
                  checked={sidebarSearchData.listingType === "all"}
                />
                <span>Rent & Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  onChange={handleInputChange}
                  checked={sidebarSearchData.listingType === "rent"}
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5"
                  onChange={handleInputChange}
                  checked={sidebarSearchData.listingType === "sale"}
                />
                <span>Sale</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  onChange={handleInputChange}
                  checked={sidebarSearchData.offer === true}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="all">Amenities:</label>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  onChange={handleInputChange}
                  checked={sidebarSearchData.parking === true}
                />
                <span>Parking</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  onChange={handleInputChange}
                  checked={sidebarSearchData.furnished === true}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <label htmlFor="sort_order">Sort:</label>
              <select
                onChange={handleInputChange}
                defaultValue={"created_desc"}
                className="border bg-white rounded-lg p-3"
                id="sort_order"
              >
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
                <option value="regularPrice_asc">Price: Low to High</option>
                <option value="regularPrice_desc">Price: High to Low</option>
              </select>
            </div>
            <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer">
              Search
            </button>
          </form>
        </div>
        <div className="border-b-2">
          <h1 className="mt-5 text-3xl font-semibold p-3 text-slate-700">
            Listing Result:
          </h1>
          <div className="p-7 flex flex-wrap gap-4">
            {loading && (
              <p className="text-center w-full text-xl text-slate-700">
                Loading...
              </p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {listings.length === 0 && !loading && (
              <p className="text-center">No listings found.</p>
            )}
            {!loading &&
              listings?.length > 0 &&
              listings.map((listing) => (
                <ListingCardComponent key={listing._id} listing={listing} />
              ))}
            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline p-7 text-center w-full"
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
