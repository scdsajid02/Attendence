import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. Admin Only.",
      });
    }

    next();
  } catch (error) {
    console.error("adminAuth error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default adminAuth;
