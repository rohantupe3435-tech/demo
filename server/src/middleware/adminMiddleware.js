/**
 * Restricts access strictly to users with the 'admin' role
 * Must be executed AFTER the protect middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Administrative access required"
    });
  }
};
