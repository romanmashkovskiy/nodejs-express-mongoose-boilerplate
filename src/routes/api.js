import PromiseRouter from 'express-promise-router';
import { values } from 'lodash';
import APIError from '../utils/APIError';
import { errorResponse } from '../utils/response';
import { loginGuard, accessGuard, resetPasswordGuard } from '../middlewares';
import {
  authController,
} from '../controllers';

const Router = PromiseRouter();

/* Auth */
Router.post('/auth/register', authController.register);
Router.post('/auth/login', loginGuard(), authController.login);
Router.get('/auth/me', accessGuard(), authController.getMe);
Router.post('/auth/email-confirm', accessGuard(), authController.confirmEmail);
Router.post('/auth/password-reset', resetPasswordGuard(), authController.resetPassword);
Router.post('/auth/password-restore', resetPasswordGuard(), authController.restorePassword);
Router.post('/auth/send-confirm-code', accessGuard(), authController.sendConfirmEmailCode);

/* Not found handler */
Router.use((req, res, next) => next(new APIError(`${req.url} - Not Found`, 404)));

/* Error handler */
Router.use((err, req, res) => {
  switch (err.name) {
    case 'ValidationError': {
      const errors = values(err.errors).map((error) => error.properties);
      console.log(`${err.name}: `, errors);
      return errorResponse(res, {
        name: err.name,
        status: 422,
        errors,
      });
    }
    default: {
      console.error(`${err.name}: `, err);
      return errorResponse(res, err);
    }
  }
});

export default Router;
