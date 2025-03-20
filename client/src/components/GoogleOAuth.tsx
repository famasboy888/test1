import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";

export default function GoogleOAuth({
  childtext,
}: {
  readonly childtext: string;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log(tokenResponse);
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const userData = await userInfo.json();

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            photo: userData.picture,
          }),
        });

        const data = await res.json();

        dispatch(signInSuccess(data));
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleClick()}
      className="bg-red-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      {childtext}
    </button>
  );
}
