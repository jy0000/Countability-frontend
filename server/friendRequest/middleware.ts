import type {Request, Response, NextFunction} from 'express';
import FriendshipCollection from '../friendship/collection';
import UserCollection from '../user/collection';
import FriendRequestCollection from './collection';

/**
 * Overview:
 * isFriendRequestToSelf
 * isFriendRequestMade
 * isFriendshipAlreadyExist
 * isFriendRequestReceiverValid
 */

/**
 * Ensures a user cannot friend themself
 */
const isFriendRequestToSelf = async (req: Request, res: Response, next: NextFunction) => {
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
 * Ensures a user cannot make a request when one is already there, or if the user they are requesting friendship already sends them one
 *
 * for post (to ensure no double request)
 */
const isFriendRequestMade = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const requestReceiver = req.body.username ? req.body.username : req.params.username;
  const user = await UserCollection.findOneByUserId(req.session.userId);

  const friendRequestFromUserToReceiver = await FriendRequestCollection.findOne(user.username, requestReceiver);
  const friendRequestFromReceiverToUser = await FriendRequestCollection.findOne(user.username, requestReceiver);

  if (friendRequestFromUserToReceiver || friendRequestFromReceiverToUser) {
    res.status(409).json({
      error: {
        followNotFound: 'Friend request already made.'
      }
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot make a request when one is already there, or if the user they are requesting friendship already sends them one
 *
 * for delete (to ensure there is a request to delete)
 */
const isFriendRequestNotMade = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const requestReceiver = req.body.username ? req.body.username : req.params.username;
  const user = await UserCollection.findOneByUserId(req.session.userId);

  const friendRequestFromUserToReceiver = await FriendRequestCollection.findOne(user.username, requestReceiver);
  const friendRequestFromReceiverToUser = await FriendRequestCollection.findOne(user.username, requestReceiver);

  if (!friendRequestFromUserToReceiver && !friendRequestFromReceiverToUser) {
    res.status(409).json({
      error: {
        followNotFound: 'Friend request not found.'
      }
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot make a request if friendship between them and the request receiver exists already
 */
const isFriendshipAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
  const friend = await FriendshipCollection.findOne(req.body.friendshipId);
  if (friend) {
    res.status(409).json({
      error: 'You have friended this user already.'
    });
    return;
  }

  next();
};

/**
 * Checks if the person to give friend to exists
 */
const isFriendRequestReceiverValid = async (req: Request, res: Response, next: NextFunction) => {
  const username = (req.body.username === undefined) ? req.params.username : req.body.username as string;

  const friendReceiver = await UserCollection.findOneByUsername(username);
  if (!friendReceiver) {
    res.status(404).json({
      error: 'User you try to befriend does not exist.'
    });
    return;
  }

  next();
};

export {
  isFriendRequestToSelf,
  isFriendRequestMade,
  isFriendshipAlreadyExist,
  isFriendRequestReceiverValid,
  isFriendRequestNotMade
};
