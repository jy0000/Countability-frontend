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
  const requestReceiverName = req.body.username ? req.body.username : req.params.username;
  const requestReceiver = await UserCollection.findOneByUsername(requestReceiverName);

  const friendRequest = await FriendRequestCollection.findAny(req.session.userId, requestReceiver._id);

  if (friendRequest) {
    res.status(409).json({
      error: 'Friend request already made by you or the requested user'
    });
    return;
  }

  next();
};

/**
 * Ensures there is a friend request available to allow for DELETE request.
 *
 * for delete (to ensure there is a request to delete)
 */
const isFriendRequestNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const friendRequest = await FriendRequestCollection.findOneById(req.params.friendRequestId);

  if (!friendRequest) {
    res.status(409).json({
      error: 'No friend request found.'
    });
    return;
  }

  next();
};

/**
 * Ensures a user cannot make a request if friendship between them and the request receiver exists already
 */
const isFriendshipAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const requestReceiverName = req.body.username ? req.body.username : req.params.username;
  const requestReceiver = await UserCollection.findOneByUsername(requestReceiverName);

  const friend = await FriendshipCollection.findAny(req.session.userId, requestReceiver._id);
  if (friend) {
    res.status(409).json({
      error: 'You are already friend with this user.'
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
      error: 'User you try to friend does not exist.'
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
  isFriendRequestNotExist
};
