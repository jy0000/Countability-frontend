import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import FriendCollection from './collection';

import * as userValidator from '../user/middleware';
import * as friendValidator from './middleware';
import * as util from './util';
import PointCollection from '../point/collection';

const router = express.Router();

/**
 * Get everyone who is friended by the user.
 *
 * @name GET /api/friend
 *
 * @return {FriendResponse[]} - An array of friends.
 */
router.get(
  '/:view?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(userId);
    // Display message to clarify who is the current user.
    const msgPrefix = `You (username: ${user.username})`;
    const msg = req.query.view === 'Users you friend' ? `${msgPrefix} have friended:` : `${msgPrefix} are friended by:`;
    const friend = req.query.view === 'Users who friend you' ? await FriendCollection.findAllFriendReceivedById(userId) : await FriendCollection.findAllFriendGivenById(userId);
    const response = friend.map(util.constructFriendResponse);
    res.status(200).json({
      message: msg,
      friendedUsers: response
    });
  }
);

/**
 * Create a new friend.
 *
 * @name POST /api/friend/
 *
 * @param {string} friendReceiver - the user to receives this user's friend.
 * @return {FriendResponse} - The created friend
 * @throws {409} - Friend already established
 * @throws {403} - Not logged-in
 * @throws {404} - User to receive friend not exits.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    friendValidator.isFriendReceiverExist,
    friendValidator.isFriendAlreadyExist,
    friendValidator.isFriendSelf
  ],
  async (req: Request, res: Response) => {
    const friendGiverId = (req.session.userId as string);
    const friendReceiver = await UserCollection.findOneByUsername(req.body.username);
    const newFriend = await FriendCollection.addOne(friendGiverId, friendReceiver._id);
    res.status(201).json({
      message: 'Hooray, you added this user as your friended friend.',
      friend: util.constructFriendResponse(newFriend)
    });
    // DELETE EVERYTHING ADDED because there was a bug about dangling removed object
    // await FriendCollection.deleteEverything();
  }
);

/**
 * Remove a friend
 *
 * @name DELETE /api/remove/:id
 *
 * @return {string} - A success message
 * @throws {400} - Friend doesn't already exist
 * @throws {403} - Not logged in
 * @throws {404} - User does not exist
 */

router.delete(
  '/:username?',
  [
    userValidator.isUserLoggedIn,
    friendValidator.isFriendReceiverExist,
    friendValidator.isFriendNotExist
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string);
    const friendedUser = await UserCollection.findOneByUsername(req.params.username);
    await FriendCollection.unfriendOneById(userId, friendedUser._id); // Delete friend
    res.status(201).json({
      message: 'You removed your friend for the user.'
    });
    await PointCollection.deleteEverything();
  }
);

export {router as friendRouter};
