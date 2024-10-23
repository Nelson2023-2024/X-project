import jwt from "jsonwebtoken";

export const generateJWTAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d"
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "strict", //CSRF prevent
    httponly: true // prevent XSS attack
  });

  return token;
};
