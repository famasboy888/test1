import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IListing } from "../types/listing/listing";
import { RootState } from "../types/signin/reduxSignIn";

export default function UpdateListing() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const navigator = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState<IListing>({
    name: "",
    description: "",
    address: "",
    listingType: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 5,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
    listingStatus: "available",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [imagesChanged, setImagesChanged] = useState(false);

  useEffect(() => {
    if (!id || id === "") {
      navigator("/not-found");
      return;
    }
    const controller = new AbortController();
    const getListingDetail = async () => {
      try {
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

        setFormData(data);

        if (data.imageUrls && data.imageUrls.length > 0) {
          const fileList = await urlsToFileList(data.imageUrls);
          setFiles(fileList);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message);
        }
      }
    };

    getListingDetail();

    return () => controller.abort();
  }, [id, currentUser?._id, navigator]);

  const urlsToFileList = async (urls: string[]): Promise<FileList> => {
    const files = await Promise.all(
      urls.map(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], `image-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
      })
    );

    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    return dt.files;
  };

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
    setImagesChanged(true);
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
    setImagesChanged(true);
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prev) => ({ ...prev, listingType: e.target.id }));
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: (e.target as HTMLInputElement).checked,
      }));
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length < 1) {
      setError("Please select at least 1 image.");
      return;
    }

    if (files.length > 6) {
      setError("You can only upload a maximum of 6 images.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUploadError(false);

      const updatedFormData = { ...formData };
      if (imagesChanged) {
        updatedFormData.imageUrls = [];
        for (const file of files) {
          const imageUrl = await handleFileUpload(file);
          if (!imageUrl) {
            setError("Failed to upload Image: " + file.name);
            setLoading(false);
            return;
          }

          updatedFormData.imageUrls.push(imageUrl as string);
        }
      }

      const res = await fetch(`/api/user/listing/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updatedFormData, userRef: currentUser?._id }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "Something went wrong, please try again.");
        return;
      }

      setLoading(false);
      return navigator(`/listing/detail/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(
          "Something went wrong, please try again later: " + error.message
        );
        setLoading(false);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    return new Promise((resolve, reject) => {
      try {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          setUploadError(true);
          reject(new Error("Invalid file type"));
          return;
        }

        fetch("/api/user/get-signature")
          .then((signatureResponse) => signatureResponse.json())
          .then(
            ({ signature, timestamp, api_key, cloud_name, upload_preset }) => {
              const uploadData = new FormData();
              uploadData.append("file", file);
              uploadData.append("upload_preset", upload_preset);
              uploadData.append("api_key", api_key);
              uploadData.append("timestamp", timestamp);
              uploadData.append("signature", signature);
              const xhr = new XMLHttpRequest();
              xhr.open(
                "POST",
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                true
              );
              xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                  const percentComplete = Math.round(
                    (event.loaded / event.total) * 100
                  );
                  setUploadProgress(percentComplete);
                }
              };
              xhr.onload = () => {
                if (xhr.status === 200) {
                  const response = JSON.parse(xhr.responseText);
                  setUploadError(false);
                  resolve(response.secure_url);
                } else {
                  console.error("Upload failed:", xhr.statusText);
                  setUploadError(true);
                  reject(new Error(xhr.statusText));
                }
              };
              xhr.onerror = () => {
                console.error("Upload failed");
                setUploadError(true);
                reject(new Error("Upload failed"));
              };
              xhr.send(uploadData);
            }
          )
          .catch((error) => {
            console.error(error);
            reject(new Error(error.message));
          });
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          reject(new Error(error.message));
        }
      }
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmitForm}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <input
              onChange={handleChangeInput}
              value={formData.name}
              className="border p-3 rounded-lg"
              type="text"
              id="name"
              placeholder="Name"
              maxLength={62}
              minLength={10}
              required
            />
            <textarea
              onChange={handleChangeInput}
              value={formData.description}
              className="border p-3 rounded-lg"
              id="description"
              placeholder="Description"
              required
            />
            <input
              onChange={handleChangeInput}
              value={formData.address}
              className="border p-3 rounded-lg"
              type="text"
              id="address"
              placeholder="Address"
              required
            />
            <div className="flex flex-wrap gap-6">
              <div className="flex gap-2">
                <input
                  onChange={handleChangeInput}
                  checked={formData.listingType === "sale"}
                  type="checkbox"
                  id="sale"
                  className="w-5"
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input
                  onChange={handleChangeInput}
                  checked={formData.listingType === "rent"}
                  type="checkbox"
                  id="rent"
                  className="w-5"
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input
                  onChange={handleChangeInput}
                  checked={formData.parking}
                  type="checkbox"
                  id="parking"
                  className="w-5"
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input
                  onChange={handleChangeInput}
                  checked={formData.furnished}
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input
                  onChange={handleChangeInput}
                  checked={formData.offer}
                  type="checkbox"
                  id="offer"
                  className="w-5"
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChangeInput}
                  value={formData.bedrooms}
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
                  onChange={handleChangeInput}
                  value={formData.bathrooms}
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
                  onChange={handleChangeInput}
                  value={formData.regularPrice}
                  className="border border-gray-300 p-3 rounded-lg"
                  type="number"
                  id="regularPrice"
                  min={5}
                  max={100000}
                  required
                />
                <div className="flex flex-col items-center">
                  <span>Regular Price</span>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    onChange={handleChangeInput}
                    value={formData.discountedPrice}
                    className="border border-gray-300 p-3 rounded-lg"
                    type="number"
                    id="discountedPrice"
                    min={0}
                    max={100000}
                    required
                  />
                  <div className="flex flex-col items-center">
                    <span>Discounted Price</span>
                    <span className="text-xs">($ / month)</span>
                  </div>
                </div>
              )}
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
            <p className="flex justify-center">
              {uploadError && (
                <span className="text-red-500">
                  There was an error uploading the file.
                  <br />
                  Check image format is (jpg, jpeg, png).
                </span>
              )}
              {!uploadError && uploadProgress > 0 && uploadProgress < 100 && (
                <span className="text-slate-700">
                  {`Uploading ${uploadProgress}%`}
                </span>
              )}
              {!uploadError && uploadProgress === 100 && (
                <span className="text-green-700">Uploaded successfully</span>
              )}
            </p>
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
            className="p-3 w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-not-allowed cursor-pointer"
          >
            Update List
          </button>
        </div>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {uploadError && <div className="mt-4 text-red-600">{uploadError}</div>}
    </main>
  );
}
