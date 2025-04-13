import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IListing } from "../types/listing/listing";
import { IUser } from "../types/signin/reduxSignIn";

export default function Contact({ listing }: { listing: IListing }) {
  const [landlord, setLandlord] = useState<IUser>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing?.userRef}`, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }

        setLandlord(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message);
        }
      }
    };

    getLandlord();

    return () => controller.abort();
  }, [listing?.userRef]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for <span>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            value={message}
            onChange={handleTextChange}
            className="w-full h-32 border border-gray-300 rounded-lg p-2 mt-2"
            placeholder="Write a message..."
          ></textarea>
          <Link
            className="bg-slate-700 text-white p-3 text-center rounded-lg hover:opacity-95 cursor-pointer"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
      {error && <p className="text-red-700">{error}</p>}
    </>
  );
}
