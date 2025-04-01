export default function CreateListing() {
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
                className="p-3 border border-gray-300 rounded w-full cursor-pointer"
                type="file"
                id="images"
                accept="image/w"
                multiple
              />
              <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 cursor-pointer">
                Upload
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">
            Create List
          </button>
        </div>
      </form>
    </main>
  );
}
