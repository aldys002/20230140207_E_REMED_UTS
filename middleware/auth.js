const checkRole = (roleRequired) => {
  return (req, res, next) => {

    const userRole = req.headers['x-user-role'];

    if (!userRole) {
      return res.status(401).json({ 
        message: "Akses ditolak. Header x-user-role tidak ditemukan." 
      });
    }

    if (userRole !== roleRequired) {
      return res.status(403).json({ 
        message: `Akses dilarang. Fitur ini hanya untuk ${roleRequired}.` 
      });
    }

    next();
  };
};

module.exports = { checkRole };