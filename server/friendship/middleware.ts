import type {Request, Response, NextFunction} from 'express';
import FriendCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a friend not exists. (for delete request, friend removal)
 */
const isFriendNotExist = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const friendUsername = req.body.username ? req.body.username : req.params.username;
  const friendReceiver = await UserCollection.findOneByUsername(friendUsername);
  const friend = await FriendCollection.findOne(req.session.userId, friendReceiver._id);
  if (!friend) {
    res.status(409).json({
      error: {
        followNotFound: 'No friend between you and this user.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a friend already exists. (for post request, friend creation)
 */
const isFriendAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
  const friendReceiver = await UserCollection.findOneByUsername(req.body.username);
  const friend = await FriendCollection.findOne(req.session.userId, friendReceiver._id);
  if (friend) {
    res.status(409).json({
      error: 'You have friended this user already.'
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot enfriend themself
 */
const isFriendSelf = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (user.username === req.body.username) {
    res.status(405).json({
      error: 'Cannot friend yourself.'
    });
    return;
  }

  next();
};

/**
 * Checks if the person to give friend to exists
 */
const isFriendReceiverExist = async (req: Request, res: Response, next: NextFunction) => {
  const username = (req.body.username === undefined) ? req.params.username : req.body.username as string;

  const friendReceiver = await UserCollection.findOneByUsername(username);
  if (!friendReceiver) {
    res.status(404).json({
      error: 'User does not exist.'
    });
    return;
  }

  next();
};

export {
  isFriendAlreadyExist,
  isFriendNotExist,
  isFriendSelf,
  isFriendReceiverExist
};
