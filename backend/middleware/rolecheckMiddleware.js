// Yeh ek factory function hai jo allowed roles ki list lega aur ek middleware return karega
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    // 1. Pehle check karo ki req.user exist karta hai ya nahi
    // (req.user hume hamare pichle 'protect' middleware se milega)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user details missing' 
      });
    }

    // 2. Check karo ki kya user ka role allowed roles me shamil hai?
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access Denied: Role '${req.user.role}' is not allowed to perform this action` 
      });
    }

    // Agar role match ho gaya, toh agle function (controller) pe bhej do
    next();
  };
};

module.exports = { authorizeRoles };