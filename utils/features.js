import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  // Generate token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Debug info
  console.log("------ COOKIE DEBUG ------");
  console.log("User ID:", user.id);
  console.log("Generated Token:", token);
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Sending cookie with settings:");
  console.log({
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  console.log("--------------------------");

  // Cookie must be sameSite: "none" + secure: true for production
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: true,      // required for cross-site cookies
      sameSite: "none",  // required for cross-site cookies
      maxAge: 15 * 60 * 1000,
    })
    .json({
      success: true,
      message,
    });
};
