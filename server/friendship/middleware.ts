import type {Request, Response, NextFunction} from 'express';
import FriendshipCollection from './collection';

/**
 * Overview:
 * isFriendshipAlreadyExist (for post)
 * isFriendshipNotExist (for delete)
 */

/**
 * Checks if a friend exists. (for post request, friendship adding)
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
 * Checks if a friend not exists. (for delete request, friendship removal)
 */
const isFriendshipNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const friend = await FriendshipCollection.findOne(req.body.friendshipId);
  if (!friend) {
    res.status(409).json({
      error: 'You have never friended this user.'
    });
    return;
  }

  next();
};

export {
  isFriendshipAlreadyExist,
  isFriendshipNotExist
};
