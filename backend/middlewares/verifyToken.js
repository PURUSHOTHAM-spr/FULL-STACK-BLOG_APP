import jwt from "jsonwebtoken";
import { UserTypeModel } from "../Models/UserModel.js";

export const verifyToken = (roles = []) => {
  return async (req, res, next) => {

    let token;

    // check Authorization header
    if (req.headers.authorization) {
      const [scheme, value] = req.headers.authorization.split(" ");
      if (scheme !== "Bearer" || !value) {
        return res.status(401).json({
          message: "Invalid authorization header",
        });
      }
      token = value;
    }

    // fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await UserTypeModel.findById(decoded.userId).select(
        "_id role isActive",
      );

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          message: "Account is blocked",
        });
      }

      req.user = {
        ...decoded,
        role: user.role,
      };

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied"
        });
      }

      next();

    } catch (err) {
      return res.status(401).json({
        message: "Invalid token"
      });
    }
  };
};