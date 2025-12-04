const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  if (req.accepts('html')) {
    const redirect = encodeURIComponent(req.originalUrl || '/');
    return res.redirect(`/login?redirect=${redirect}`);
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = { ensureAuthenticated };
