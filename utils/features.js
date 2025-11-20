import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const isDev = process.env.NODE_ENV === "Development";

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: isDev ? "lax" : "none",
     domain: ".authorization-assessment-frontend.vercel.app",
      secure: isDev ? false : true,
    })
    .json({
      success: true,
      message,
    });
};
