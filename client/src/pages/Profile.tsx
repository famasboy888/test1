import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProfileFailure,
  deleteProfileStart,
  deleteProfileSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
  updateProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
} from "../redux/user/userSlice";
import { RootState } from "../types/signin/reduxSignIn";

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const { currentUser, error } = useSelector(
    (state: RootState) => state.user || { loading: false, error: null }
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    avatar: "",
  });

  console.log(formData);

  // Clean up to reduce memory leaks
  useEffect(() => {
    return () => {
      if (formData.avatar) {
        URL.revokeObjectURL(formData.avatar);
      }
    };
  }, [formData.avatar]);

  const handleFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError(true);
        return;
      } else {
        setUploadError(false);
      }
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateProfileStart());

      const updatedFormData = { ...formData };

      if (file) {
        const avatarUrl = await handleFileUpload(file);
        if (!avatarUrl) {
          dispatch(updateProfileFailure("Failed to upload image"));
          return;
        }
        updatedFormData.avatar = avatarUrl as string;
      }

      const res = await fetch(`/api/user/profile/update/${currentUser?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateProfileFailure(data.message));
        return;
      }

      dispatch(updateProfileSuccess(data));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        dispatch(updateProfileFailure(error.message));
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteProfileStart());

      const res = await fetch(`/api/user/profile/delete/${currentUser?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteProfileFailure(data.message));
        return;
      }

      dispatch(deleteProfileSuccess(data));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        dispatch(deleteProfileFailure(error.message));
      }
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutStart());

      const res = await fetch(`/api/auth/signout/${currentUser?._id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutFailure(data.message));
      }

      dispatch(signOutSuccess(data));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        dispatch(signOutFailure(error.message));
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    return new Promise((resolve, reject) => {
      try {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          setUploadError(true);
          reject("Invalid file type");
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
                  reject("Upload failed");
                }
              };
              xhr.onerror = () => {
                console.error("Upload failed");
                setUploadError(true);
                reject("Upload failed");
              };
              xhr.send(uploadData);
            }
          )
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            src={avatarPreview || currentUser?.avatar}
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
          id="email"
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg bg-slate-600"
          disabled
          defaultValue={currentUser?.email}
        />
        <input
          id="username"
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-85 cursor-pointer">
          Update
        </button>
        <Link
          className="bg-green-600 text-center text-white p-3 rounded-lg uppercase hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
        <Link
          className="bg-green-600 text-center text-white p-3 rounded-lg uppercase hover:opacity-95"
          to={"/user/listings"}
        >
          Show Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <button
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOutUser}
          className="text-red-700 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
