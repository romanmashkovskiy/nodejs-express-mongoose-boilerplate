import passport from 'passport';
import { errorResponse } from '../utils/response';
import APIError from '../utils/APIError';

export default () => (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      const message = info ? info.message : 'Forbidden';
      const code = info && info.expiredAt ? 401 : 403;

      return errorResponse(res, new APIError(message, code));
    }

    req.user = user;

    next();
  })(req, res, next);
};
