import passport from 'passport';
import { errorResponse } from '../utils/response';
import APIError from '../utils/APIError';

export default () => (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      const message = info ? info.message : 'Login failed';

      return errorResponse(res, new APIError(message, 400));
    }
    req.user = user;

    next();
  })(req, res, next);
};
