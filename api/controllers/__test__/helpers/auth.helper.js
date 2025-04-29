import bcryptjs from "bcryptjs";
import User from "../../../models/user.model.js";

export const createTestUser = async () => {
  const hashedPassword = bcryptjs.hashSync("password123", 10);

  return await User.create({
    username: "testuser",
    email: "test@example.com",
    password: hashedPassword,
  });
};

export const getAuthToken = async (request) => {
  const response = await request.post("/api/auth/signin").send({
    email: "test@example.com",
    password: "password123",
  });

  return response.headers["set-cookie"].find((cookie) =>
    cookie.includes("access_token")
  );
};
