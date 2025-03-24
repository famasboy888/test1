import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types/signin/reduxSignIn";

export default function Profile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useSelector(
    (state: RootState) => state.user || { loading: false, error: null }
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    avatar: "",
  });

  console.log(formData);

  // useEffect(() => {
  //   if (file) {
  //     handleFileUpload(file);
  //   }
  // }, [file]);

  const handleFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Clean up to reduce memory leaks
  useEffect(() => {
    return () => {
      if (formData.avatar) {
        URL.revokeObjectURL(formData.avatar);
      }
    };
  }, [formData.avatar]);

  const handleFileUpload = async (file: File) => {
    try {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        setUploadError(true);
        return;
      }

      const signatureResponse = await fetch("/api/user/get-signature");
      const { signature, timestamp, api_key, cloud_name, upload_preset } =
        await signatureResponse.json();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("image", file);
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

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadError(false);
          setFormData({ ...formData, avatar: response.secure_url });
        } else {
          console.error("Upload failed:", xhr.statusText);
          setUploadError(true);
        }
      };

      xhr.onerror = () => {
        console.error("Upload failed");
        setUploadError(true);
      };

      xhr.send(uploadData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={handleFileChanged}
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
            src={formData.avatar || currentUser?.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </button>
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
