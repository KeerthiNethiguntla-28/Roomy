import passport from 'passport';

export const passportAuth = (req, res, next) => {
  passport.authenticate(
    'user-jwt',
    (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).json({ message: info?.message || 'Unauthorized' }); // Send back Passport.js error message
      }
      // Authentication successful, proceed with the route handler
      req.user = user;
      next();
    },
    { session: false }
  )(req, res, next);
};

export const passportAdminUserAuth = (req, res, next) => {
  passport.authenticate(
    'admin-jwt',
    (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!user) {
        return res.status(401).json({ message: info?.message || 'Unauthorized' }); // Send back Passport.js error message
      }
      // Authentication successful, proceed with the route handler
      req.adminUser = user;
      next();
    },
    { session: false }
  )(req, res, next);
};
