import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import FriendRequestCollection from './collection';

import * as userValidator from '../user/middleware';
import * as friendRequestValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Overview:
 * Get all friend requests sent/received by the current user
 * Post a friend request (add)
 * Delete a friend request (delete)
 */

/**
 * Get all friend requests sent by the current user
 *
 * @name GET /api/friendRequest?requestDirection=requestDirection
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    // Get current session user
    const userId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(userId);

    const prefix = `You (username: ${user.username})`;
    const msg = req.query.requestDirection === 'Out' ? `${prefix} have sent friend requests to:` : `${prefix} have received friend requests by:`;
    const friendRequests = req.query.requestDirection === 'Out' ? await FriendRequestCollection.findAllSentByUserId(userId) : await FriendRequestCollection.findAllReceivedByUserId(userId);
    const response = friendRequests.map(util.constructResponse);
    res.status(200).json({
      message: msg,
      requests: response
    });
  }
);

/**
 * Send a friend request
 *
 * @name POST /api/friendRequest/
 *
 * @param {string} friendReceiver - the user to receives this user's friend.
 * @return {FriendResponse} - The created friend
 * @throws {403} - Not logged-in
 * @throws {409} - Friendship already established, or friend request already made by user / or to user
 * @throws {404} - User to receive friend request does not exits.
 * @throws {405} - User friends themselvs
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    friendRequestValidator.isFriendRequestReceiverValid, // This should be placed before request made
    friendRequestValidator.isFriendRequestToSelf,
    friendRequestValidator.isFriendRequestMade,
    friendRequestValidator.isFriendshipAlreadyExist
  ],
  async (req: Request, res: Response) => {
    const requestSenderId = (req.session.userId as string);
    const requestReceiver = await UserCollection.findOneByUsername(req.body.username);
    const newFriendRequest = await FriendRequestCollection.addOne(requestSenderId, requestReceiver._id);
    res.status(201).json({
      message: 'Hooray, you sent a friend request to this user!',
      requests: util.constructResponse(newFriendRequest)
    });
    // DELETE EVERYTHING ADDED because there was a bug about dangling removed object
    // await FriendRequestCollection.deleteEverything();
    // await FriendshipCollection.deleteEverything();
  }
);

/**
 * Remove a friend request made
 *
 * @name DELETE /api/remove/:id
 *
 * @return {string} - A success message
 * @throws {400} - Friendship doesn't already exist
 * @throws {403} - Not logged in
 */

router.delete(
  '/:friendRequestId?', // Define req.params here
  [
    userValidator.isUserLoggedIn,
    friendRequestValidator.isFriendRequestNotExist
  ],
  async (req: Request, res: Response) => {
    await FriendRequestCollection.deleteOne(req.params.friendRequestId);
    res.status(201).json({
      message: 'You removed your friend request for this user.'
    });
  }
);

export {router as friendRequestRouter};
