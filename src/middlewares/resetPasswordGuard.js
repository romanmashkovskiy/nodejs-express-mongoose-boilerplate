import { errorResponse } from '../utils/response';
import APIError from '../utils/APIError';
import { User } from '../models';

export default () => async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);

  if (!user) {
    return errorResponse(res, new APIError('Not found.', 404));
  }

  req.user = user;

  next();
};
