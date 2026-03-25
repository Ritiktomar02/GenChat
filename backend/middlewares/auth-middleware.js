import jwt from "jsonwebtoken";

export const isUser = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - no token provided" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
