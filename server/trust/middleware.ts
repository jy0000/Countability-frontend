import type {Request, Response, NextFunction} from 'express';
import TrustCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a trust not exists. (for delete request, trust removal)
 */
const isTrustNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const trustReceiver = await UserCollection.findOneByUsername(req.params.username);
  const trust = await TrustCollection.findOne(req.session.userId, trustReceiver._id);
  if (!trust) {
    res.status(409).json({
      error: {
        followNotFound: 'No trust between you and this user.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a trust already exists. (for post request, trust creation)
 */
const isTrustAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
  const trustReceiver = await UserCollection.findOneByUsername(req.body.username);
  const trust = await TrustCollection.findOne(req.session.userId, trustReceiver._id);
  if (trust) {
    res.status(409).json({
      error: {
        message: 'You have trusted this user already.'
      }
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot entrust themself
 */
const isTrustSelf = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (user.username === req.body.username) {
    res.status(405).json({
      error: {
        message: 'Cannot trust yourself.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the person to give trust to exists
 */
const isTrustReceiverExist = async (req: Request, res: Response, next: NextFunction) => {
  const username = (req.body.username === undefined) ? req.params.username : req.body.username as string;
  const trustReceiver = await UserCollection.findOneByUsername(username);
  if (!trustReceiver) {
    res.status(404).json({
      error: {
        message: 'User does not exist.'
      }
    });
    return;
  }

  next();
};

export {
  isTrustAlreadyExist,
  isTrustNotExist,
  isTrustSelf,
  isTrustReceiverExist
};
