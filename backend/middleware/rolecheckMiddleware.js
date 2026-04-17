const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user details missing' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access Denied: Role '${req.user.role}' is not allowed to perform this action` 
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };