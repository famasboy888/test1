import { useState } from "react";

export default function CreateListing() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    sale: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    imageUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) {
      setError("Please select images");
      return;
    }
    if (selectedFiles && selectedFiles.length > 6) {
      setError("You can only select maximum of 6 images");
      return;
    }
    setFiles(selectedFiles);
  };

  const handleRemoveImage = (index: number) => {
    if (!files) return;
    const dt = new DataTransfer();

    Array.from(files).forEach((file, idx) => {
      if (idx !== index) {
        dt.items.add(file);
      }
    });

    setFiles(dt.files);
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <input
              className="border p-3 rounded-lg"
              type="text"
              id="name"
              placeholder="Name"
              maxLength={62}
              minLength={10}
              required
            />
            <textarea
              className="border p-3 rounded-lg"
              id="description"
              placeholder="Description"
              required
            />
            <input
              className="border p-3 rounded-lg"
              type="text"
              id="address"
              placeholder="Address"
              required
            />
            <div className="flex flex-wrap gap-6">
              <div className="flex gap-2">
                <input type="checkbox" id="sale" className="w-5" />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="rent" className="w-5" />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="parking" className="w-5" />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="furnished" className="w-5" />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id="offer" className="w-5" />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  className="border border-gray-300 p-3 rounded-lg"
                  type="number"
                  id="bedrooms"
                  min={1}
                  max={20}
                  required
                />
                <span>Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="border border-gray-300 p-3 rounded-lg"
                  type="number"
                  id="bathrooms"
                  min={1}
                  max={20}
                  required
                />
                <span>Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="border border-gray-300 p-3 rounded-lg"
                  type="number"
                  id="regularPrice"
                  min={1}
                  max={20}
                  required
                />
                <div className="flex flex-col items-center">
                  <span>Regular Price</span>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="border border-gray-300 p-3 rounded-lg"
                  type="number"
                  id="discountedPrice"
                  min={1}
                  max={20}
                  required
                />
                <div className="flex flex-col items-center">
                  <span>Discounted Price</span>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <p className="font-semibold">Images:</p>
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6 images)
            </span>
            <div className="flex gap-4">
              <input
                onChange={handleImageSelect}
                className="p-3 border border-gray-300 rounded w-full cursor-pointer"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
            </div>
            <div className="h-[300px] overflow-y-auto mt-6 pr-2">
              {files &&
                Array.from(files).map((file, index) => (
                  <div
                    key={index}
                    className="flex gap-4 mb-4 bg-gray-50 p-2 rounded justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border rounded overflow-hidden flex-shrink-0">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow max-w-[200px]">
                        <p className="text-sm text-gray-700 truncate overflow-hidden">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            disabled={loading}
            className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
          >
            Create List
          </button>
        </div>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </main>
  );
}
